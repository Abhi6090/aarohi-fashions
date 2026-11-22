# Aarohi Ethnic Wear — website preview

**Open the public preview:** [https://abhi6090.github.io/aarohi-fashions/](https://abhi6090.github.io/aarohi-fashions/)

This is a design preview for Aarohi Fashions. It uses sample products and prices; checkout is a demo and does not accept orders or payments.

## Run the preview locally

1. Double-click **Start Website.bat**.
2. Keep the black command window open while browsing.
3. Open [http://localhost:8000](http://localhost:8000) on this computer.
4. Stop the server with **Ctrl+C** in the command window.

To view it on a phone over Wi-Fi, connect the phone and computer to the same Wi-Fi, find the computer’s IPv4 address with `ipconfig`, then open `http://<computer-ip>:8000` on the phone. Keep the computer awake and the server window open.

## What the preview can do

- Browse and filter sample kurta sets, co-ord sets, embroidered suits and kidswear.
- Search styles, view product details and choose a size.
- Add items to a bag; the bag is saved only in that browser on that device.
- Walk through a demo checkout. It does not submit an order, save the details or take payment.
- Use the WhatsApp order buttons after Aarohi’s business number is added in `app.js`.

## Before accepting real orders

Replace sample names, photos, descriptions and prices with the real catalogue. Add the store’s WhatsApp number and customer email, and set the size guide, shipping and returns information. Connect a payment provider before accepting online payments. The newsletter form is a visual preview and does not collect email addresses.

The public preview deploys from the `main` branch through GitHub Actions. The site files are `index.html`, `styles.css` and `app.js`; images are in `assets/`.
