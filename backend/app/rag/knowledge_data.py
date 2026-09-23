"""
Curated Skincare Educational Knowledge Base for Skinova AI RAG.
Contains structured, clinically vetted educational documents with chunking metadata.
"""

KNOWLEDGE_DOCUMENTS = [
    {
        "id": "kb_acne_01",
        "category": "Acne & Breakouts",
        "title": "Understanding Visible Acne-Like Breakouts and Sebum Dysregulation",
        "content": (
            "Acne-like breakouts visually manifest as open comedones (blackheads), closed comedones (whiteheads), "
            "and inflammatory papules or pustules. Sebum overproduction, follicular hyperkeratinization (dead skin cell "
            "accumulation), and Cutibacterium acnes bacterial colonization contribute to pore blockage. In educational skincare, "
            "mild visible breakouts often respond favorably to non-comedogenic hydration and gentle keratolytic actives such as "
            "Salicylic Acid (BHA, 0.5-2%) and Azelaic Acid (5-10%). Over-washing or aggressive scrubs can disrupt the epidermal "
            "barrier, exacerbating rebound sebum production and inflammation."
        ),
        "source": "American Academy of Dermatology (AAD) Educational Skincare Guidelines",
        "tags": ["acne", "breakouts", "salicylic acid", "bha", "pimples", "blackheads", "whiteheads", "azelaic acid"]
    },
    {
        "id": "kb_acne_02",
        "category": "Acne & Breakouts",
        "title": "Over-The-Counter Skincare Actives for Breakout-Prone Skin",
        "content": (
            "Over-the-counter ingredients commonly studied for acne-prone skin include: "
            "1. Salicylic Acid (lipophilic beta-hydroxy acid that penetrates lipid-rich sebaceous pores to clear cellular debris). "
            "2. Benzoyl Peroxide (2.5-5% produces oxygen species that reduce C. acnes; 2.5% is as effective as 10% with significantly less irritation). "
            "3. Niacinamide (Vitamin B3, 2-5%) modulates sebum secretion, calms visible redness, and supports skin barrier ceramides. "
            "4. Over-the-counter Retinoids (such as Adapalene 0.1%) normalize keratinocyte differentiation and prevent microcomedone formation."
        ),
        "source": "Journal of Clinical and Aesthetic Dermatology Review on Topical Actives",
        "tags": ["benzoyl peroxide", "salicylic acid", "adapalene", "retinoids", "niacinamide", "actives"]
    },
    {
        "id": "kb_barrier_01",
        "category": "Skin Barrier & Dryness",
        "title": "The Stratum Corneum Barrier and Transepidermal Water Loss (TEWL)",
        "content": (
            "The skin barrier functions like a 'brick and mortar' wall, where corneocytes are the bricks and intercellular lipids "
            "(ceramides, cholesterol, and free fatty acids in a 3:1:1 physiological ratio) form the moisture-retaining mortar. "
            "When the stratum corneum is compromised by harsh surfactants, weather, or excessive exfoliation, Transepidermal "
            "Water Loss (TEWL) accelerates. Symptoms include tightness, flaking, stinging upon application of basic moisturizers, "
            "and diffuse redness. Repair strategies emphasize humectants (Glycerin, Hyaluronic Acid) followed by physiologic "
            "emollients (Ceramide NP/AP/EOP) and occlusives (Squalane, Petrolatum)."
        ),
        "source": "Dermatologic Therapy - Skin Barrier Function and Restoration",
        "tags": ["barrier", "dryness", "ceramides", "tewl", "hydration", "stinging", "flaking", "hyaluronic acid"]
    },
    {
        "id": "kb_oiliness_01",
        "category": "Oiliness & Pores",
        "title": "Managing High Surface Sebum and Visible Pores",
        "content": (
            "Pore size is largely determined by genetic factors and androgenic stimulation of sebaceous glands. When pores fill "
            "with oxidized sebum and cellular debris, or when surrounding collagen loses elasticity, pores appear visibly enlarged. "
            "Stripping skin with harsh alcohol-based astringents triggers compensatory hyperseborrhea (rebound oiliness). "
            "Evidence-based management includes gentle gel cleansers, Niacinamide (modulates surface sebum rate without dehydrating), "
            "BHA 1-2% for follicular clearing, and lightweight water-gel moisturizers with hyaluronic acid."
        ),
        "source": "International Journal of Cosmetic Science - Sebaceous Gland Activity and Pore Dynamics",
        "tags": ["oiliness", "pores", "sebum", "shine", "enlarged pores", "niacinamide", "matte"]
    },
    {
        "id": "kb_pigment_01",
        "category": "Hyperpigmentation",
        "title": "Visible Dark Spots, Post-Inflammatory Hyperpigmentation (PIH) and Melasma",
        "content": (
            "Visible skin pigmentation often stems from Post-Inflammatory Hyperpigmentation (PIH) following blemishes or UV-induced "
            "melanogenesis. Tyrosinase is the rate-limiting enzyme in melanin synthesis. Well-tolerated non-prescription ingredients "
            "that target visible discoloration include: "
            "1. L-Ascorbic Acid (Vitamin C, 10-15%) - potent antioxidant that suppresses tyrosinase and neutralizes reactive oxygen species. "
            "2. Alpha Arbutin (1-2%) - gentle hydroquinone derivative that curbs hyperactive melanocytes. "
            "3. Tranexamic Acid (2-5%) - inhibits plasminogen activation and downstream UV-triggered inflammatory cascades. "
            "4. Azelaic Acid (10%) - selectively targets hyperactive melanocytes. "
            "Daily broad-spectrum sunscreen (SPF 30+) is mandatory because UV radiation rapidly re-darkens hyperpigmented lesions."
        ),
        "source": "British Journal of Dermatology - Clinical Approaches to Hyperpigmentation",
        "tags": ["hyperpigmentation", "dark spots", "vitamin c", "alpha arbutin", "tranexamic acid", "melasma", "pih", "sunscreen"]
    },
    {
        "id": "kb_redness_01",
        "category": "Sensitive Skin & Redness",
        "title": "Understanding Visible Redness, Erythema and Skin Sensitivity",
        "content": (
            "Visible facial redness (erythema) can arise from transient flushing, barrier impairment, or reactive cutaneous vascularity. "
            "Sensitive skin displays heightened neurosensory reactivity and lower irritant thresholds. Key soothing ingredients "
            "supported by dermatological research include Centella Asiatica (madecassoside/asiaticoside), Panthenol (Pro-Vitamin B5), "
            "Allantoin, Colloidal Oatmeal, and green tea polyphenols. Individuals with visible persistent redness should avoid physical "
            "scrubs, synthetic fragrances, essential oils, denatured alcohol, and high-concentration unbuffered exfoliating acids."
        ),
        "source": "Dermatology and Therapy - Cutaneous Sensitivity and Neurovascular Reactivity",
        "tags": ["redness", "erythema", "sensitive skin", "centella", "panthenol", "soothing", "calming"]
    },
    {
        "id": "kb_compat_01",
        "category": "Active Ingredient Compatibility",
        "title": "Safe Layering of Potent Skincare Actives",
        "content": (
            "Active ingredient safety and layering guidelines: "
            "1. Retinoids + AHA/BHA Acids: Combining strong chemical exfoliants (Glycolic, Lactic, Salicylic) in the same session with "
            "Retinol or Adapalene dramatically increases irritation, flaking, and barrier collapse. Recommended approach: Alternate nights "
            "(e.g., Exfoliant on Monday, Retinoid on Tuesday/Thursday). "
            "2. Retinol + Benzoyl Peroxide: Traditional Retinol can be oxidized and deactivated by Benzoyl Peroxide when applied together, "
            "while doubling dryness. Use Benzoyl Peroxide in the morning and Retinoid at night. "
            "3. Vitamin C (L-Ascorbic Acid) + Niacinamide: Modern formulations are generally safe together; however, sensitive complexions "
            "may experience transient flushing. Best used: Vitamin C in AM (photoprotection synergy with SPF), Niacinamide in PM. "
            "4. Patch testing: Always introduce one new active at a time for 2-3 weeks before incorporating another."
        ),
        "source": "Cosmetic Dermatology Guidelines on Ingredient Synergy and Conflict Mitigation",
        "tags": ["layering", "compatibility", "retinol", "aha", "bha", "vitamin c", "benzoyl peroxide", "irritation", "conflict"]
    },
    {
        "id": "kb_sunscreen_01",
        "category": "Sun Protection",
        "title": "Daily Broad-Spectrum Photoprotection Fundamentals",
        "content": (
            "UVA radiation (320-400 nm) penetrates deeply into dermal layers, degrading collagen and driving photoaging and pigmentary "
            "darkening. UVB radiation (290-320 nm) induces erythema (sunburn) and direct DNA pyrimidine dimers. Broad-spectrum SPF 30 or higher "
            "is the single most clinically impactful preventive skincare step. Mineral filters (Zinc Oxide, Titanium Dioxide) sit on the skin "
            "and are well-suited for reactive/sensitive skin. Chemical filters provide lightweight, invisible finishes. Sunscreen should "
            "be applied as the final daytime skincare step (approximately 1/4 teaspoon for the face) and reapplied every two hours of direct exposure."
        ),
        "source": "Skin Cancer Foundation & WHO Photoprotection Guidelines",
        "tags": ["sunscreen", "spf", "uva", "uvb", "zinc oxide", "photoaging", "sun protection"]
    },
    {
        "id": "kb_redflags_01",
        "category": "Safety & Red Flags",
        "title": "Clinical Red Flags Requiring Immediate Dermatological Evaluation",
        "content": (
            "AI skincare applications must never evaluate conditions requiring clinical biopsy, culture, or prescription medical intervention. "
            "Immediate in-person evaluation by a board-certified dermatologist or emergency medical provider is essential if observing: "
            "1. ABCDE signs of pigmented lesions: Asymmetry, Border irregularity, Color variegation (black/blue/white), Diameter >6mm, or Rapid Evolution/Enlarging. "
            "2. Spontaneous bleeding, oozing, weeping crusted sores, or ulcers that fail to heal after 2-3 weeks. "
            "3. Severe localized swelling, escalating intense pain, fever, or red streaking indicative of cellulitis or bacterial infection. "
            "4. Acute pervasive rash with mucosal involvement (eyes, lips, mouth) or respiratory symptoms, which may signify an anaphylactic or drug reaction."
        ),
        "source": "American Academy of Dermatology - Clinical Red Flags & Melanoma Detection Protocol",
        "tags": ["red flags", "dermatologist", "melanoma", "bleeding", "infection", "pain", "doctor", "emergency", "abcde"]
    }
]
