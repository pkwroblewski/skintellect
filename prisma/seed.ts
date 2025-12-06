/**
 * Prisma Database Seed Script
 * 
 * This script populates the database with initial sample data for development and testing.
 * Run with: npx prisma db seed
 */

import { PrismaClient, IngredientFunction, ProductCategory, BenefitCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // ========================================
  // SEED BRANDS
  // ========================================
  console.log("📦 Seeding brands...");

  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: "cosrx" },
      update: {},
      create: {
        slug: "cosrx",
        name: "COSRX",
        country: "South Korea",
        description: "K-beauty brand known for effective, no-nonsense skincare products with a focus on skin barrier health.",
        isCrueltyFree: true,
        isVegan: false,
      },
    }),
    prisma.brand.upsert({
      where: { slug: "the-ordinary" },
      update: {},
      create: {
        slug: "the-ordinary",
        name: "The Ordinary",
        country: "Canada",
        description: "Clinical formulations with integrity. High-quality skincare at affordable prices.",
        isCrueltyFree: true,
        isVegan: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: "paulas-choice" },
      update: {},
      create: {
        slug: "paulas-choice",
        name: "Paula's Choice",
        country: "United States",
        description: "Research-backed skincare with a focus on gentle, effective formulations.",
        isCrueltyFree: true,
        isVegan: false,
      },
    }),
    prisma.brand.upsert({
      where: { slug: "cerave" },
      update: {},
      create: {
        slug: "cerave",
        name: "CeraVe",
        country: "United States",
        description: "Developed with dermatologists. Essential ceramides to help restore and maintain the skin's natural barrier.",
        isCrueltyFree: false,
        isVegan: false,
      },
    }),
    prisma.brand.upsert({
      where: { slug: "la-roche-posay" },
      update: {},
      create: {
        slug: "la-roche-posay",
        name: "La Roche-Posay",
        country: "France",
        description: "Dermatological skincare brand recommended by dermatologists worldwide.",
        isCrueltyFree: false,
        isVegan: false,
      },
    }),
  ]);

  console.log(`✅ Seeded ${brands.length} brands\n`);

  // ========================================
  // SEED INGREDIENTS
  // ========================================
  console.log("🧪 Seeding ingredients...");

  const ingredients = await Promise.all([
    // Moisturizing & Hydrating
    prisma.ingredient.upsert({
      where: { slug: "hyaluronic-acid" },
      update: {},
      create: {
        slug: "hyaluronic-acid",
        name: "Hyaluronic Acid",
        inciName: "Sodium Hyaluronate",
        aliases: ["HA", "Sodium Hyaluronate", "Hyaluronan"],
        description: "A powerful humectant that can hold up to 1000x its weight in water, providing deep and long-lasting hydration.",
        detailedExplanation: "Hyaluronic acid is naturally present in human skin and decreases with age. When applied topically, it draws moisture from the environment into the skin, plumping and hydrating. Different molecular weights penetrate to different depths - low molecular weight penetrates deeper, while high molecular weight stays on the surface for immediate hydration.",
        functions: [IngredientFunction.moisturizing, IngredientFunction.humectant, IngredientFunction.anti_aging],
        isActive: true,
        comedogenicRating: 0,
        irritationLevel: 0,
        isFungalAcneTrigger: false,
        isAllergen: false,
        isReefUnsafe: false,
        benefits: ["Deep hydration", "Plumps skin", "Reduces fine lines", "Suitable for all skin types"],
        concerns: [],
        goodFor: ["dry", "dehydrated", "aging", "all"],
      },
    }),
    prisma.ingredient.upsert({
      where: { slug: "glycerin" },
      update: {},
      create: {
        slug: "glycerin",
        name: "Glycerin",
        inciName: "Glycerin",
        aliases: ["Glycerol", "Vegetable Glycerin"],
        description: "A versatile humectant that attracts water to the skin and helps maintain moisture balance.",
        functions: [IngredientFunction.moisturizing, IngredientFunction.humectant],
        isActive: false,
        comedogenicRating: 0,
        irritationLevel: 0,
        isFungalAcneTrigger: false,
        isAllergen: false,
        isReefUnsafe: false,
        benefits: ["Hydrates skin", "Strengthens barrier", "Non-comedogenic"],
        goodFor: ["all"],
      },
    }),
    prisma.ingredient.upsert({
      where: { slug: "snail-secretion-filtrate" },
      update: {},
      create: {
        slug: "snail-secretion-filtrate",
        name: "Snail Secretion Filtrate",
        inciName: "Snail Secretion Filtrate",
        aliases: ["Snail Mucin", "Snail Extract"],
        description: "A multi-functional ingredient that promotes skin repair, hydration, and anti-aging benefits through its rich composition of glycoproteins, hyaluronic acid, and glycolic acid.",
        functions: [IngredientFunction.moisturizing, IngredientFunction.soothing, IngredientFunction.anti_aging],
        isActive: true,
        comedogenicRating: 0,
        irritationLevel: 0,
        isFungalAcneTrigger: false,
        isAllergen: false,
        isReefUnsafe: false,
        benefits: ["Promotes healing", "Deeply hydrating", "Reduces scarring", "Smooths texture"],
        goodFor: ["all", "acne-prone", "damaged"],
      },
    }),

    // Exfoliating Acids
    prisma.ingredient.upsert({
      where: { slug: "salicylic-acid" },
      update: {},
      create: {
        slug: "salicylic-acid",
        name: "Salicylic Acid",
        inciName: "Salicylic Acid",
        aliases: ["BHA", "Beta Hydroxy Acid"],
        description: "An oil-soluble BHA that penetrates deep into pores to dissolve oil and dead skin cells, making it excellent for acne-prone skin.",
        detailedExplanation: "Salicylic acid is lipophilic, meaning it can cut through oil and penetrate into clogged pores. It works by breaking down the bonds between dead skin cells, allowing them to shed more easily. It also has anti-inflammatory properties, making it ideal for acne treatment.",
        functions: [IngredientFunction.exfoliating, IngredientFunction.acne_fighting],
        isActive: true,
        comedogenicRating: 0,
        irritationLevel: 2,
        isFungalAcneTrigger: false,
        isAllergen: false,
        isReefUnsafe: false,
        benefits: ["Unclogs pores", "Reduces breakouts", "Smooths texture", "Minimizes pores"],
        concerns: ["May cause dryness", "Increases sun sensitivity"],
        goodFor: ["oily", "acne-prone", "combination"],
      },
    }),
    prisma.ingredient.upsert({
      where: { slug: "niacinamide" },
      update: {},
      create: {
        slug: "niacinamide",
        name: "Niacinamide",
        inciName: "Niacinamide",
        aliases: ["Vitamin B3", "Nicotinamide"],
        description: "A versatile form of vitamin B3 that strengthens the skin barrier, minimizes pores, evens skin tone, and regulates oil production.",
        functions: [IngredientFunction.brightening, IngredientFunction.anti_aging, IngredientFunction.soothing],
        isActive: true,
        comedogenicRating: 0,
        irritationLevel: 0,
        isFungalAcneTrigger: false,
        isAllergen: false,
        isReefUnsafe: false,
        benefits: ["Minimizes pores", "Evens skin tone", "Strengthens barrier", "Regulates oil", "Reduces fine lines"],
        goodFor: ["all", "oily", "acne-prone"],
      },
    }),

    // Soothing Ingredients
    prisma.ingredient.upsert({
      where: { slug: "centella-asiatica" },
      update: {},
      create: {
        slug: "centella-asiatica",
        name: "Centella Asiatica",
        inciName: "Centella Asiatica Extract",
        aliases: ["Cica", "Tiger Grass", "Gotu Kola"],
        description: "A powerful calming ingredient known for its ability to soothe irritation, promote healing, and strengthen the skin barrier.",
        functions: [IngredientFunction.soothing, IngredientFunction.anti_aging],
        isActive: true,
        comedogenicRating: 0,
        irritationLevel: 0,
        isFungalAcneTrigger: false,
        isAllergen: false,
        isReefUnsafe: false,
        benefits: ["Calms irritation", "Promotes healing", "Strengthens barrier", "Antioxidant"],
        goodFor: ["sensitive", "irritated", "acne-prone"],
      },
    }),
    prisma.ingredient.upsert({
      where: { slug: "allantoin" },
      update: {},
      create: {
        slug: "allantoin",
        name: "Allantoin",
        inciName: "Allantoin",
        aliases: [],
        description: "A gentle soothing agent that promotes skin healing and cell regeneration.",
        functions: [IngredientFunction.soothing, IngredientFunction.moisturizing],
        isActive: false,
        comedogenicRating: 0,
        irritationLevel: 0,
        isFungalAcneTrigger: false,
        isAllergen: false,
        isReefUnsafe: false,
        benefits: ["Soothes skin", "Promotes healing", "Moisturizes"],
        goodFor: ["all", "sensitive"],
      },
    }),
    prisma.ingredient.upsert({
      where: { slug: "betaine" },
      update: {},
      create: {
        slug: "betaine",
        name: "Betaine",
        inciName: "Betaine",
        aliases: ["Trimethylglycine"],
        description: "A gentle humectant derived from sugar beets that helps retain moisture and soothe the skin.",
        functions: [IngredientFunction.moisturizing, IngredientFunction.soothing],
        isActive: false,
        comedogenicRating: 0,
        irritationLevel: 0,
        isFungalAcneTrigger: false,
        isAllergen: false,
        isReefUnsafe: false,
        benefits: ["Retains moisture", "Soothes skin", "Gentle"],
        goodFor: ["all", "sensitive"],
      },
    }),

    // Antioxidants
    prisma.ingredient.upsert({
      where: { slug: "green-tea-extract" },
      update: {},
      create: {
        slug: "green-tea-extract",
        name: "Green Tea Extract",
        inciName: "Camellia Sinensis Leaf Extract",
        aliases: ["EGCG", "Green Tea Polyphenols"],
        description: "Rich in polyphenols that protect skin from environmental damage and have anti-inflammatory properties.",
        functions: [IngredientFunction.antioxidant, IngredientFunction.soothing],
        isActive: true,
        comedogenicRating: 0,
        irritationLevel: 0,
        isFungalAcneTrigger: false,
        isAllergen: false,
        isReefUnsafe: false,
        benefits: ["Antioxidant protection", "Reduces inflammation", "Anti-aging"],
        goodFor: ["all"],
      },
    }),

    // Ceramides
    prisma.ingredient.upsert({
      where: { slug: "ceramide-np" },
      update: {},
      create: {
        slug: "ceramide-np",
        name: "Ceramide NP",
        inciName: "Ceramide NP",
        aliases: ["Ceramide 3"],
        description: "An essential lipid that helps restore and maintain the skin's natural barrier.",
        functions: [IngredientFunction.moisturizing, IngredientFunction.occlusive],
        isActive: true,
        comedogenicRating: 0,
        irritationLevel: 0,
        isFungalAcneTrigger: false,
        isAllergen: false,
        isReefUnsafe: false,
        benefits: ["Restores barrier", "Locks in moisture", "Reduces sensitivity"],
        goodFor: ["dry", "sensitive", "damaged"],
      },
    }),

    // Potentially Problematic Ingredients (for demo purposes)
    prisma.ingredient.upsert({
      where: { slug: "isopropyl-palmitate" },
      update: {},
      create: {
        slug: "isopropyl-palmitate",
        name: "Isopropyl Palmitate",
        inciName: "Isopropyl Palmitate",
        aliases: [],
        description: "An emollient that helps products spread smoothly but can clog pores and feed fungal acne.",
        functions: [IngredientFunction.emollient],
        isActive: false,
        comedogenicRating: 4,
        irritationLevel: 1,
        isFungalAcneTrigger: true,
        isAllergen: false,
        isReefUnsafe: false,
        benefits: ["Smooths application", "Softens skin"],
        concerns: ["Can clog pores", "May trigger fungal acne"],
        goodFor: [],
      },
    }),
    prisma.ingredient.upsert({
      where: { slug: "fragrance" },
      update: {},
      create: {
        slug: "fragrance",
        name: "Fragrance",
        inciName: "Parfum",
        aliases: ["Parfum", "Aroma"],
        description: "Synthetic or natural scent additives that may cause irritation in sensitive individuals.",
        functions: [IngredientFunction.fragrance],
        isActive: false,
        comedogenicRating: 0,
        irritationLevel: 3,
        isFungalAcneTrigger: false,
        isAllergen: true,
        isReefUnsafe: false,
        benefits: ["Pleasant scent"],
        concerns: ["May cause irritation", "Common allergen", "Can sensitize skin over time"],
        goodFor: [],
      },
    }),
  ]);

  console.log(`✅ Seeded ${ingredients.length} ingredients\n`);

  // ========================================
  // SEED PRODUCTS
  // ========================================
  console.log("🧴 Seeding products...");

  // Get brand IDs
  const cosrx = brands.find((b) => b.slug === "cosrx")!;
  const paulasChoice = brands.find((b) => b.slug === "paulas-choice")!;
  const theOrdinary = brands.find((b) => b.slug === "the-ordinary")!;

  // Get ingredient IDs
  const ingredientMap = new Map(ingredients.map((i) => [i.slug, i]));

  // COSRX Advanced Snail 92
  const snailCream = await prisma.product.upsert({
    where: { slug: "cosrx-advanced-snail-92-cream" },
    update: {},
    create: {
      slug: "cosrx-advanced-snail-92-cream",
      name: "Advanced Snail 92 All in One Cream",
      brandId: cosrx.id,
      category: ProductCategory.moisturizer,
      description: "A lightweight, gel-type moisturizer that contains 92% snail secretion filtrate to nourish and repair damaged skin while providing intense hydration. Perfect for all skin types, including sensitive and acne-prone skin.",
      size: "100ml",
      safetyScore: 9.2,
      isFungalAcneSafe: true,
      isFragranceFree: true,
      isAlcoholFree: true,
      isParabenFree: true,
      isSulfateFree: true,
      isSiliconeFree: true,
      isOilFree: true,
      isVegan: false,
      isCrueltyFree: true,
      isReefSafe: true,
      ingredientCount: 4,
      activeCount: 2,
      triggerCount: 0,
      averageRating: 4.5,
      reviewCount: 128,
    },
  });

  // Add ingredients to snail cream
  const snailIngredients = ["snail-secretion-filtrate", "betaine", "hyaluronic-acid", "allantoin"];
  for (let i = 0; i < snailIngredients.length; i++) {
    const ing = ingredientMap.get(snailIngredients[i]);
    if (ing) {
      await prisma.productIngredient.upsert({
        where: {
          productId_ingredientId: {
            productId: snailCream.id,
            ingredientId: ing.id,
          },
        },
        update: {},
        create: {
          productId: snailCream.id,
          ingredientId: ing.id,
          position: i + 1,
          isHighlighted: i === 0 || i === 2,
          customNote: i === 0 ? "Main active ingredient at 92% concentration" : null,
        },
      });
    }
  }

  // Add benefits to snail cream
  await Promise.all([
    prisma.productBenefit.upsert({
      where: { productId_benefit: { productId: snailCream.id, benefit: BenefitCategory.hydrating } },
      update: {},
      create: { productId: snailCream.id, benefit: BenefitCategory.hydrating, ingredientCount: 4, description: "Deep moisture from multiple humectants" },
    }),
    prisma.productBenefit.upsert({
      where: { productId_benefit: { productId: snailCream.id, benefit: BenefitCategory.anti_aging } },
      update: {},
      create: { productId: snailCream.id, benefit: BenefitCategory.anti_aging, ingredientCount: 2, description: "Promotes collagen and reduces fine lines" },
    }),
    prisma.productBenefit.upsert({
      where: { productId_benefit: { productId: snailCream.id, benefit: BenefitCategory.soothing } },
      update: {},
      create: { productId: snailCream.id, benefit: BenefitCategory.soothing, ingredientCount: 3, description: "Calms irritation and redness" },
    }),
    prisma.productBenefit.upsert({
      where: { productId_benefit: { productId: snailCream.id, benefit: BenefitCategory.barrier_repair } },
      update: {},
      create: { productId: snailCream.id, benefit: BenefitCategory.barrier_repair, ingredientCount: 2, description: "Strengthens skin barrier" },
    }),
  ]);

  // Paula's Choice BHA
  const bhaPaula = await prisma.product.upsert({
    where: { slug: "paulas-choice-bha-liquid-exfoliant" },
    update: {},
    create: {
      slug: "paulas-choice-bha-liquid-exfoliant",
      name: "Skin Perfecting 2% BHA Liquid Exfoliant",
      brandId: paulasChoice.id,
      category: ProductCategory.exfoliant,
      description: "A cult-favorite leave-on exfoliant with 2% salicylic acid that unclogs pores, smooths wrinkles, and evens skin tone. Suitable for all skin types including sensitive skin.",
      size: "118ml",
      safetyScore: 8.5,
      isFungalAcneSafe: true,
      isFragranceFree: true,
      isAlcoholFree: false,
      isParabenFree: true,
      isSulfateFree: true,
      isSiliconeFree: true,
      isOilFree: true,
      isVegan: true,
      isCrueltyFree: true,
      isReefSafe: true,
      ingredientCount: 3,
      activeCount: 2,
      triggerCount: 0,
      averageRating: 4.7,
      reviewCount: 512,
    },
  });

  // Add ingredients to BHA
  const bhaIngredients = ["salicylic-acid", "green-tea-extract", "glycerin"];
  for (let i = 0; i < bhaIngredients.length; i++) {
    const ing = ingredientMap.get(bhaIngredients[i]);
    if (ing) {
      await prisma.productIngredient.upsert({
        where: {
          productId_ingredientId: {
            productId: bhaPaula.id,
            ingredientId: ing.id,
          },
        },
        update: {},
        create: {
          productId: bhaPaula.id,
          ingredientId: ing.id,
          position: i + 1,
          isHighlighted: i === 0 || i === 1,
          customNote: i === 0 ? "Main exfoliating active at 2%" : null,
        },
      });
    }
  }

  // Add benefits to BHA
  await Promise.all([
    prisma.productBenefit.upsert({
      where: { productId_benefit: { productId: bhaPaula.id, benefit: BenefitCategory.exfoliating } },
      update: {},
      create: { productId: bhaPaula.id, benefit: BenefitCategory.exfoliating, ingredientCount: 1, description: "Removes dead skin cells" },
    }),
    prisma.productBenefit.upsert({
      where: { productId_benefit: { productId: bhaPaula.id, benefit: BenefitCategory.acne_fighting } },
      update: {},
      create: { productId: bhaPaula.id, benefit: BenefitCategory.acne_fighting, ingredientCount: 1, description: "Unclogs pores and prevents breakouts" },
    }),
    prisma.productBenefit.upsert({
      where: { productId_benefit: { productId: bhaPaula.id, benefit: BenefitCategory.pore_minimizing } },
      update: {},
      create: { productId: bhaPaula.id, benefit: BenefitCategory.pore_minimizing, ingredientCount: 1, description: "Reduces appearance of pores" },
    }),
    prisma.productBenefit.upsert({
      where: { productId_benefit: { productId: bhaPaula.id, benefit: BenefitCategory.brightening } },
      update: {},
      create: { productId: bhaPaula.id, benefit: BenefitCategory.brightening, ingredientCount: 1, description: "Evens skin tone" },
    }),
  ]);

  // Add concern for BHA
  const salicylicAcid = ingredientMap.get("salicylic-acid");
  if (salicylicAcid) {
    await prisma.productConcern.create({
      data: {
        productId: bhaPaula.id,
        title: "May increase sun sensitivity",
        description: "BHA can make skin more sensitive to UV rays. Use SPF daily when using this product.",
        severity: "medium",
        ingredientId: salicylicAcid.id,
      },
    });
  }

  // The Ordinary Niacinamide
  const niacinamideSerum = await prisma.product.upsert({
    where: { slug: "the-ordinary-niacinamide-10-zinc-1" },
    update: {},
    create: {
      slug: "the-ordinary-niacinamide-10-zinc-1",
      name: "Niacinamide 10% + Zinc 1%",
      brandId: theOrdinary.id,
      category: ProductCategory.serum,
      description: "A high-strength vitamin and mineral formula that targets the appearance of blemishes, pore size, and sebum production.",
      size: "30ml",
      safetyScore: 9.0,
      isFungalAcneSafe: true,
      isFragranceFree: true,
      isAlcoholFree: true,
      isParabenFree: true,
      isSulfateFree: true,
      isSiliconeFree: true,
      isOilFree: true,
      isVegan: true,
      isCrueltyFree: true,
      isReefSafe: true,
      ingredientCount: 2,
      activeCount: 1,
      triggerCount: 0,
      averageRating: 4.3,
      reviewCount: 890,
    },
  });

  // Add ingredients
  const niaIngredients = ["niacinamide", "glycerin"];
  for (let i = 0; i < niaIngredients.length; i++) {
    const ing = ingredientMap.get(niaIngredients[i]);
    if (ing) {
      await prisma.productIngredient.upsert({
        where: {
          productId_ingredientId: {
            productId: niacinamideSerum.id,
            ingredientId: ing.id,
          },
        },
        update: {},
        create: {
          productId: niacinamideSerum.id,
          ingredientId: ing.id,
          position: i + 1,
          isHighlighted: i === 0,
          customNote: i === 0 ? "High concentration at 10%" : null,
        },
      });
    }
  }

  // Add benefits
  await Promise.all([
    prisma.productBenefit.upsert({
      where: { productId_benefit: { productId: niacinamideSerum.id, benefit: BenefitCategory.pore_minimizing } },
      update: {},
      create: { productId: niacinamideSerum.id, benefit: BenefitCategory.pore_minimizing, ingredientCount: 1, description: "Visibly reduces pore size" },
    }),
    prisma.productBenefit.upsert({
      where: { productId_benefit: { productId: niacinamideSerum.id, benefit: BenefitCategory.acne_fighting } },
      update: {},
      create: { productId: niacinamideSerum.id, benefit: BenefitCategory.acne_fighting, ingredientCount: 1, description: "Helps reduce blemishes" },
    }),
    prisma.productBenefit.upsert({
      where: { productId_benefit: { productId: niacinamideSerum.id, benefit: BenefitCategory.mattifying } },
      update: {},
      create: { productId: niacinamideSerum.id, benefit: BenefitCategory.mattifying, ingredientCount: 1, description: "Controls oil and shine" },
    }),
  ]);

  console.log(`✅ Seeded 3 products with ingredients, benefits, and concerns\n`);

  // ========================================
  // SEED AFFILIATE OFFERS
  // ========================================
  console.log("🛒 Seeding affiliate offers...");

  await Promise.all([
    prisma.affiliateOffer.upsert({
      where: { id: "offer-snail-amazon" },
      update: {},
      create: {
        id: "offer-snail-amazon",
        productId: snailCream.id,
        retailerName: "Amazon",
        retailerSlug: "amazon",
        url: "https://www.amazon.com/dp/B00PBX3L7K?tag=skintellect-20",
        currency: "USD",
        price: 18.99,
        availability: "in_stock",
        displayPriority: 1,
      },
    }),
    prisma.affiliateOffer.upsert({
      where: { id: "offer-snail-yesstyle" },
      update: {},
      create: {
        id: "offer-snail-yesstyle",
        productId: snailCream.id,
        retailerName: "YesStyle",
        retailerSlug: "yesstyle",
        url: "https://www.yesstyle.com/en/cosrx-advanced-snail-92/info.html",
        currency: "USD",
        price: 21.00,
        availability: "in_stock",
        displayPriority: 2,
      },
    }),
    prisma.affiliateOffer.upsert({
      where: { id: "offer-bha-paula" },
      update: {},
      create: {
        id: "offer-bha-paula",
        productId: bhaPaula.id,
        retailerName: "Paula's Choice",
        retailerSlug: "paulas-choice",
        url: "https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201.html",
        currency: "USD",
        price: 35.00,
        availability: "in_stock",
        displayPriority: 1,
      },
    }),
    prisma.affiliateOffer.upsert({
      where: { id: "offer-bha-amazon" },
      update: {},
      create: {
        id: "offer-bha-amazon",
        productId: bhaPaula.id,
        retailerName: "Amazon",
        retailerSlug: "amazon",
        url: "https://www.amazon.com/dp/B00949CTQQ?tag=skintellect-20",
        currency: "USD",
        price: 34.00,
        originalPrice: 35.00,
        availability: "in_stock",
        displayPriority: 2,
      },
    }),
    prisma.affiliateOffer.upsert({
      where: { id: "offer-nia-sephora" },
      update: {},
      create: {
        id: "offer-nia-sephora",
        productId: niacinamideSerum.id,
        retailerName: "Sephora",
        retailerSlug: "sephora",
        url: "https://www.sephora.com/product/the-ordinary-niacinamide-10-zinc-1",
        currency: "USD",
        price: 6.50,
        availability: "in_stock",
        displayPriority: 1,
      },
    }),
  ]);

  console.log(`✅ Seeded affiliate offers\n`);

  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

