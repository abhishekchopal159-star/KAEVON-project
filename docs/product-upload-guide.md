# Product Publishing Guide

Open `/admin/products`, choose **Add product**, and complete:

- unique product name and slug;
- category and subcategory matching the storefront taxonomy;
- current price, optional compare-at price and tax/discount context;
- material, short description and full description;
- SKU/variant inventory with size, colour and available units;
- premium portrait/product image with descriptive alt text;
- publish status and merchandising flags.

Save, then verify the record in **All products**, `/shop`, the correct category route and `/product/[id]`. Related products are selected by matching category/subcategory/tags and exclude the current item.

In default `firestore` media mode the admin upload is optimized and stored with the product document; no manual public-folder edit is required. Large production catalogues should enable Firebase Storage or another CDN, then set `NEXT_PUBLIC_PRODUCT_MEDIA_MODE=storage` after bucket security and billing are configured.

Recommended source: WebP/AVIF or high-quality JPEG, clean background, no embedded UI text, consistent crop and honest product representation.
