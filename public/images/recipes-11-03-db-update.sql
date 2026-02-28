-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 03, 2025 at 08:57 PM
-- Server version: 8.0.42
-- PHP Version: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pantry_ce_show_live`
--

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `ingredients` text NOT NULL,
  `instructions` text NOT NULL,
  `nutrition_info` text,
  `notes` text,
  `average_rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `rating_count` int NOT NULL DEFAULT '0',
  `prep_time` int DEFAULT NULL,
  `cook_time` int DEFAULT NULL,
  `yields` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `author_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`id`, `title`, `description`, `ingredients`, `instructions`, `nutrition_info`, `notes`, `average_rating`, `rating_count`, `prep_time`, `cook_time`, `yields`, `image_url`, `author_id`) VALUES
(32, '\"Sneaky Silken\" Tofu Ranch Dressing', 'A ridiculously creamy, tangy, and classic-tasting ranch dressing made entirely from a silken tofu base. It\'s oil-free, dairy-free, and loaded with fresh herbs, making it the perfect WFPB dip for veggies or a dressing for hefty salads.', '[\"1 block (12-14 oz) firm or extra-firm silken tofu, drained\",\"3 tbsp fresh lemon juice\",\"1 tbsp apple cider vinegar\",\"1.5 tsp onion powder\",\"1.5 tsp garlic powder\",\"1 tsp kosher salt (or 3\\/4 tsp table salt, adjust to taste)\",\"1\\/2 tsp freshly ground black pepper\",\"3 tbsp fresh dill, finely minced\",\"3 tbsp fresh chives, finely minced\",\"2 tbsp fresh parsley, finely minced\",\"Optional: 1-3 tbsp unsweetened plant-based milk (like soy or oat), only if needed for thinning\"]', '[\"Prep the Tofu: Gently open the silken tofu package and carefully drain away all excess water. Pat the block dry with a paper towel. (No need to press silken tofu, just get the surface liquid off).\",\"Create the Base: In a high-speed blender or food processor, combine the drained silken tofu, lemon juice, apple cider vinegar, onion powder, garlic powder, salt, and black pepper.\",\"Blend Until Smooth: Secure the lid and blend on high for 45-60 seconds. Stop and scrape down the sides of the blender, then blend again until the mixture is perfectly smooth, creamy, and has no lumps. It should resemble sour cream or mayonnaise.\",\"Fold in the Herbs: Transfer the smooth tofu base to a medium-sized bowl. Add the minced fresh dill, chives, and parsley.\",\"Stir, Don\'t Blend!: Use a spatula or whisk to fold the fresh herbs into the base.Note: We do this after blending to keep the dressing a creamy white colour with lovely green specks, just like classic ranch. If you blend the herbs, your dressing will turn a pale green (which is fine, but less traditional!).\",\"Adjust and Chill: Taste the dressing. Does it need more salt? More lemon for tang? Adjust it now. Once you\'re happy, cover the bowl and chill in the refrigerator for at least 30 minutes. This step is crucial, as it allows all those herb and garlic flavours to \\\"marry\\\" the tofu base.\",\"Final Check: After chilling, give it one last stir. If the dressing is thicker than you\'d like (especially for a salad dressing), whisk in the optional plant milk, one tablespoon at a time, until you reach your desired consistency.\"]', '{\"Calories\":\"15\",\"Fat\":\"0.6g (36% of Calories)\",\"Saturated Fat\":\"0.1g\",\"Cholesterol\":\"0mg\",\"Sodium\":\"155mg (7% DV)\",\"Carbohydrates\":\"0.7g (19% of Calories)\",\"Dietary Fiber\":\"0.1g (0% DV)\",\"Total Sugars\":\"0.3g\",\"Protein\":\"2.1g (45% of Calories)\",\"Vitamin A\":\"96 IU (2% DV)\",\"Vitamin C\":\"1.8mg (2% DV)\",\"Vitamin D\":\"0 IU (0% DV)\",\"Vitamin E\":\"0.1mg (0% DV)\",\"Vitamin K\":\"11.2mcg (9% DV)\",\"Thiamin (B1)\":\"<0.1mg\",\"Riboflavin (B2)\":\"<0.1mg\",\"Niacin (B3)\":\"<0.1mg\",\"Vitamin B6\":\"<0.1mg\",\"Vitamin B12\":\"0mcg (0% DV)\",\"Calcium\":\"20mg (2% DV)\",\"Copper\":\"<0.1mg (5% DV)\",\"Folate\":\"7.5mcg (2% DV)\",\"Iron\":\"0.3mg (2% DV)\",\"Magnesium\":\"6.1mg (1% DV)\",\"Phosphorus\":\"26mg (2% DV)\",\"Potassium\":\"51mg (1% DV)\",\"Selenium\":\"1.2mcg (2% DV)\",\"Zinc\":\"0.2mg (2% DV)\"}', 'Why Oil-Free? You\'ll notice we didn\'t add any oil. This is intentional and aligns with our WFPB goals. The silken tofu provides all the necessary fat and creamy mouthfeel to make the dressing rich and satisfying without needing processed oils.\r\nHerb Variations: Don\'t have fresh herbs? You can use dried, but the flavour will be different (more \"pantry\" ranch). Use 1 teaspoon of each dried herb (dill, parsley, chives) and let it chill for at least an hour so they can rehydrate fully.\r\nStorage: This will keep beautifully in an airtight container (like a mason jar) in the fridge for up to 5-7 days.\r\nAssumptions:\r\nNutritional information is estimated based on a 14oz block of firm silken tofu and the ingredients listed.\r\nPercentages for \"Daily Value\" (DV) are based on a 2,000-calorie reference diet.\r\nPercentages for macronutrient calories are calculated from the gram amounts (Fat: 9cal/g, Carbs: 4cal/g, Protein: 4cal/g).', 5.00, 1, 10, 0, 'Approx. 2 cups (16 servings)', 'uploads/recipes/690903891cbdf-silken-tofu-ranch.png', 2),
(33, 'Crispy Air-Fryer Orange-Sesame Tofu', 'These addictive tofu bites are air-fried to crispy-chewy perfection before being tossed in a vibrant, sticky glaze of fresh orange juice, soy sauce, garlic, ginger, and toasted sesame. A perfect, high-protein addition to rice bowls, noodle dishes, or just for snacking on!', '[\"For the Crispy Tofu:\",\"1 block (14-16 oz) super-firm tofu (or extra-firm, well-pressed)\",\"2 tbsp cornstarch\",\"1 tbsp low-sodium soy sauce (or tamari for gluten-free)\",\"Optional: A light spritz of high-heat cooking spray (like avocado oil)\",\"For the Orange-Sesame Glaze:\",\"1\\/2 cup fresh orange juice (from ~1 large orange)\",\"1 tbsp orange zest (from the same orange)\",\"3 tbsp low-sodium soy sauce (or tamari)\",\"2 tbsp maple syrup\",\"1 tbsp rice vinegar\",\"1 tsp toasted sesame oil\",\"2 cloves garlic, finely minced\",\"1 tsp fresh ginger, grated\",\"1 tbsp cornstarch (for the slurry)\",\"2 tbsp water (for the slurry)\",\"For Garnish:\",\"1 tbsp toasted sesame seeds\",\"2 green onions, thinly sliced\"]', '[\"Press the Tofu (The Crucial Step): If using extra-firm tofu (packed in water), you must press it. Wrap the block in paper towels or a clean kitchen towel, place it on a plate, and set something heavy on top (like a cast-iron skillet or some books). Let it press for at least 30 minutes, or ideally 1 hour. If using super-firm (vacuum-packed) tofu, you can skip this and just pat it dry.\",\"Prep the Tofu: Once pressed, pat the tofu block very dry. Tear the tofu into 1-inch, irregular-shaped \\\"bites.\\\"Why tear, not cube? Tearing creates more rough, craggy edges, which means more surface area for the cornstarch to stick to and more nooks for the glaze to cling to. It\'s a game-changer for texture!\",\"Season & Dredge: Place the tofu bites in a medium bowl. Drizzle with the 1 tbsp of soy sauce and toss gently. Let it sit for a minute to absorb. Now, sprinkle the 2 tbsp of cornstarch over the tofu and toss again until every piece is coated in a light, dry, dusty layer.\",\"Preheat the Air Fryer: Set your Emeril Lagasse Air-Fryer (or any air fryer) to 400\\u00b0F (200\\u00b0C).\",\"Air-Fry: Arrange the coated tofu bites in a single layer on the air fryer tray or in the basket. Ensure they are not touching to allow for maximum crisping (work in batches if needed).\",\"(Optional but Recommended Oil Step): Lightly spritz the top of the tofu bites with the cooking spray. This is what helps them get truly golden-brown and crispy, rather than just dry.\",\"Fry Time: Air-fry for 15-18 minutes. Shake the basket or flip the pieces on the tray about halfway through. They are done when they are golden-brown, firm to the touch, and crispy on the edges.\",\"Make the Glaze: While the tofu is frying, make the glaze. In a small saucepan, whisk together all the glaze ingredients (orange juice, zest, soy sauce, maple syrup, rice vinegar, toasted sesame oil, garlic, and ginger) EXCEPT for the cornstarch slurry (the 1 tbsp cornstarch + 2 tbsp water).\",\"Simmer & Thicken: Bring the glaze mixture to a gentle simmer over medium heat. In a separate small bowl, whisk the 1 tbsp cornstarch and 2 tbsp water until completely smooth. Once the sauce is simmering, slowly pour in the slurry, whisking constantly. Continue to whisk for 1-2 minutes as the sauce rapidly thickens into a beautiful, glossy glaze. Remove from the heat.\",\"Combine & Serve: When the tofu is perfectly crispy, transfer the hot bites directly into the saucepan with the glaze (or pour the glaze over the tofu in a large bowl). Toss gently to coat every single piece.\",\"Garnish: Serve immediately, topped with a generous sprinkle of toasted sesame seeds and sliced green onions.\"]', '{\"Calories\":\"196\",\"Fat\":\"6.9g (31% of Calories)\",\"Saturated Fat\":\"1g (4% DV)\",\"Cholesterol\":\"0mg (0% DV)\",\"Sodium\":\"497mg (22% DV)\",\"Carbohydrates\":\"22.8g (46% of Calories)\",\"Dietary Fiber\":\"1.5g (5% DV)\",\"Total Sugars\":\"10.1g\",\"Protein\":\"12.3g (23% of Calories)\",\"Vitamin A\":\"241 IU (5% DV)\",\"Vitamin C\":\"18.2mg (20% DV)\",\"Vitamin D\":\"0 IU (0% DV)\",\"Vitamin E\":\"0.3mg (2% DV)\",\"Vitamin K\":\"4.1mcg (3% DV)\",\"Thiamin (B1)\":\"0.1mg (10% DV)\",\"Riboflavin (B2)\":\"0.1mg (5% DV)\",\"Niacin (B3)\":\"0.7mg (4% DV)\",\"Vitamin B6\":\"0.1mg (7% DV)\",\"Vitamin B12\":\"0mcg (0% DV)\",\"Calcium\":\"120mg (9% DV)\",\"Copper\":\"0.2mg (24% DV)\",\"Folate\":\"26.5mcg (7% DV)\",\"Iron\":\"2.1mg (12% DV)\",\"Magnesium\":\"45mg (11% DV)\",\"Phosphorus\":\"176mg (14% DV)\",\"Potassium\":\"233mg (5% DV)\",\"Selenium\":\"7.5mcg (14% DV)\",\"Zinc\":\"0.9mg (8% DV)\"}', 'Rationale for Oil (Toasted Sesame): You\'ll see we used 1 tsp of toasted sesame oil. This is a non-negotiable flavouring ingredient, not a cooking oil. It has a very low smoke point and is used in small quantities for its deep, nutty, aromatic flavour, which is essential to the \"sesame\" profile of this dish. This is a perfect example of using an oil mindfully for a massive culinary payoff.\r\nRationale for Oil (Cooking Spray): The optional spritz of oil in the air fryer is a \"culinary advantage\" choice. Tofu dredged in cornstarch can become very dry and almost chalky without a tiny bit of fat to help it \"fry.\" The spray ensures a crispy, golden texture, not just a hard, dry one. It’s highly recommended for the best results.\r\nTofu Choice: Super-firm, vacuum-sealed tofu is a brilliant shortcut here as it requires no pressing. If you can only find extra-firm (in water), do not skip the pressing step. The drier the tofu, the crispier the result.\r\nAssumptions:\r\nNutritional data is estimated using a 16 oz block of extra-firm tofu and low-sodium tamari.\r\nDaily Value (DV) percentages are based on a 2,000-calorie reference diet.\r\nPercentages for macronutrient calories are calculated from the gram amounts (Fat: 9cal/g, Carbs: 4cal/g, Protein: 4cal/g).', 0.00, 0, 15, 15, '4 servings (as a protein main)', 'uploads/recipes/690905a05e265-orange-sesame-tofu-bites.png', 2),
(34, 'Emma’s Homemade Taco Seasoning', 'A robust, smoky, and perfectly balanced taco seasoning blend that blows store-bought packets out of the water. This WFPB-friendly mix is free of fillers and anti-caking agents, giving you pure, vibrant flavour with a fraction of the sodium.', '[\"1\\/4 cup (4 tbsp) chili powder (a standard mild blend)\",\"1.5 tbsp ground cumin\",\"1 tbsp smoked paprika\",\"2 tsp garlic powder\",\"2 tsp onion powder\",\"1 tsp dried oregano (preferably Mexican oregano, but any will work)\",\"1 tsp sea salt (or to taste; see notes)\",\"1 tsp freshly ground black pepper\",\"1\\/4 tsp cayenne pepper (or more, to your desired heat level)\"]', '[\"Measure: Add all ingredients to a small bowl or, even better, directly into a small glass jar with a tight-fitting lid.\",\"Combine: Whisk the spices together in the bowl until thoroughly combined and no clumps remain.\",\"Seal: If using a jar, secure the lid and shake vigorously for 30-45 seconds until the blend is uniform in colour.\",\"Store: Store in your airtight container in a cool, dark, and dry place (like your pantry or a spice drawer). It will remain at peak freshness for about 6 months, but is safe to use for much longer.\"]', '{\"Calories\":\"18\",\"Fat\":\"0.5g (25% of Calories)\",\"Saturated Fat\":\"0.1g\",\"Cholesterol\":\"0mg\",\"Sodium\":\"192mg (8% DV)\",\"Carbohydrates\":\"2.7g (60% of Calories)\",\"Dietary Fiber\":\"1.1g (4% DV)\",\"Total Sugars\":\"0.4g\",\"Protein\":\"0.6g (13% of Calories)\",\"Vitamin A\":\"1275 IU (25% DV)\",\"Vitamin C\":\"0.7mg (1% DV)\",\"Vitamin D\":\"0 IU (0% DV)\",\"Vitamin E\":\"0.2mg (1% DV)\",\"Vitamin K\":\"2.2mcg (2% DV)\",\"Thiamin (B1)\":\"<0.1mg\",\"Riboflavin (B2)\":\"<0.1mg\",\"Niacin (B3)\":\"0.3mg (2% DV)\",\"Vitamin B6\":\"0.1mg (5% DV)\",\"Vitamin B12\":\"0mcg (0% DV)\",\"Calcium\":\"20mg (2% DV)\",\"Copper\":\"<0.1mg (4% DV)\",\"Folate\":\"2.4mcg (1% DV)\",\"Iron\":\"0.9mg (5% DV)\",\"Magnesium\":\"10mg (2% DV)\",\"Phosphorus\":\"21mg (2% DV)\",\"Potassium\":\"82mg (2% DV)\",\"Selenium\":\"0.5mcg (1% DV)\",\"Zinc\":\"0.2mg (1% DV)\"}', ')\r\n1 tsp freshly ground black pepper\r\n1/4 tsp cayenne pepper (or more, to your desired heat level)\r\nInstructions:\r\nMeasure: Add all ingredients to a small bowl or, even better, directly into a small glass jar with a tight-fitting lid.\r\nCombine: Whisk the spices together in the bowl until thoroughly combined and no clumps remain.\r\nSeal: If using a jar, secure the lid and shake vigorously for 30-45 seconds until the blend is uniform in colour.\r\nStore: Store in your airtight container in a cool, dark, and dry place (like your pantry or a spice drawer). It will remain at peak freshness for about 6 months, but is safe to use for much longer.\r\nNutritional Information:\r\nPer Serving: Approx. 2 teaspoons (which is the typical \"serving\" for a packet)\r\nCalories: 18\r\nFat: 0.5g (25% of Calories)\r\nSaturated Fat: 0.1g\r\nCholesterol: 0mg\r\nSodium: 192mg (8% DV)\r\nCarbohydrates: 2.7g (60% of Calories)\r\nDietary Fiber: 1.1g (4% DV)\r\nTotal Sugars: 0.4g\r\nProtein: 0.6g (13% of Calories)\r\nVitamins:\r\nVitamin A: 1275 IU (25% DV)\r\nVitamin C: 0.7mg (1% DV)\r\nVitamin D: 0 IU (0% DV)\r\nVitamin E: 0.2mg (1% DV)\r\nVitamin K: 2.2mcg (2% DV)\r\nB Vitamins:\r\nThiamin (B1): <0.1mg\r\nRiboflavin (B2): <0.1mg\r\nNiacin (B3): 0.3mg (2% DV)\r\nVitamin B6: 0.1mg (5% DV)\r\nVitamin B12: 0mcg (0% DV)\r\nMinerals:\r\nCalcium: 20mg (2% DV)\r\nCopper: <0.1mg (4% DV)\r\nFolate: 2.4mcg (1% DV)\r\nIron: 0.9mg (5% DV)\r\nMagnesium: 10mg (2% DV)\r\nPhosphorus: 21mg (2% DV)\r\nPotassium: 82mg (2% DV)\r\nSelenium: 0.5mcg (1% DV)\r\nZinc: 0.2mg (1% DV)\r\nNotes:\r\nHow to Use: A general rule of thumb is 2-3 tablespoons of this blend per 1 pound of \"ground\" (like crumbled tofu, tempeh, or lentils) or per 1 (15-oz) can of beans. Sauté your base, add the seasoning, and then add a splash of water or vegetable broth to create a light \"sauce\" that helps the seasoning coat everything.\r\nSalt-Free Version: For a completely salt-free blend (zero sodium!), simply omit the 1 tsp of sea salt. The blend will still be incredibly flavourful. You can then salt your final dish to taste, giving you total control.\r\nHeat Control: This recipe as written is mild.\r\nFor Medium Heat: Increase cayenne to 1/2 tsp.\r\nFor Hot: Increase cayenne to 1 tsp.\r\nSmoky Flavour: The smoked paprika is what gives this blend its magic. If you only have sweet paprika, it will still work, but you\'ll miss that lovely, complex smokiness.\r\nAssumptions:\r\nNutritional information is estimated based on the ingredients listed.\r\n\"Serving size\" is set at 2 tsp to mimic commercial packet information. The total batch yields ~13 such servings.\r\nPercentages for \"Daily Value\" (DV) are based on a 2,000-calorie reference diet.\r\nPercentages for macronutrient calories are calculated from the gram amounts (Fat: 9cal/g, Carbs: 4cal/g, Protein: 4cal/g).', 0.00, 0, 5, 0, 'Approx. 1/2 cup (about 13 servings)', 'uploads/recipes/690909166bf28-emmas-homeade-taco-seasoning.png', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
