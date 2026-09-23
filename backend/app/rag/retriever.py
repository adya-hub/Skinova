"""
RAG Retriever for Skinova AI.
Performs keyword & semantic term-overlap retrieval with citation metadata.
"""

import math
import re
from typing import List, Dict, Any
from .knowledge_data import KNOWLEDGE_DOCUMENTS

class SkinovaRetriever:
    def __init__(self, documents: List[Dict[str, Any]] = None):
        self.documents = documents or KNOWLEDGE_DOCUMENTS
        self.corpus_tokens = []
        self.doc_freqs = {}
        self.total_docs = len(self.documents)
        self._build_index()

    def _tokenize(self, text: str) -> List[str]:
        # Normalize and split on non-alphanumeric
        tokens = re.findall(r'\b[a-zA-Z0-9_\-]{2,}\b', text.lower())
        # Filter basic stop words
        stopwords = {
            "the", "and", "is", "in", "to", "of", "for", "with", "a", "an", "on", 
            "that", "it", "as", "are", "at", "be", "this", "by", "from", "or", "you", "your"
        }
        return [t for t in tokens if t not in stopwords]

    def _build_index(self):
        for doc in self.documents:
            full_text = f"{doc['title']} {doc['content']} {' '.join(doc.get('tags', []))}"
            tokens = self._tokenize(full_text)
            self.corpus_tokens.append(tokens)
            unique_tokens = set(tokens)
            for t in unique_tokens:
                self.doc_freqs[t] = self.doc_freqs.get(t, 0) + 1

    def retrieve(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        query_tokens = self._tokenize(query)
        if not query_tokens:
            return self.documents[:top_k]

        scores = []
        for idx, doc in enumerate(self.documents):
            score = 0.0
            doc_tokens = self.corpus_tokens[idx]
            doc_len = len(doc_tokens) or 1
            token_counts = {}
            for t in doc_tokens:
                token_counts[t] = token_counts.get(t, 0) + 1

            for qt in query_tokens:
                if qt in token_counts:
                    tf = token_counts[qt] / doc_len
                    df = self.doc_freqs.get(qt, 1)
                    idf = math.log((self.total_docs + 1) / (df + 0.5)) + 1.0
                    score += tf * idf

            # Boost if query matches tags or category
            for tag in doc.get("tags", []):
                if tag.lower() in query.lower():
                    score += 1.5

            if doc["category"].lower() in query.lower():
                score += 1.0

            scores.append((score, doc))

        scores.sort(key=lambda x: x[0], reverse=True)
        results = []
        for score, doc in scores[:top_k]:
            results.append({
                "id": doc["id"],
                "category": doc["category"],
                "title": doc["title"],
                "content": doc["content"],
                "source": doc["source"],
                "score": round(score, 3)
            })
        return results

# Default singleton
retriever = SkinovaRetriever()
