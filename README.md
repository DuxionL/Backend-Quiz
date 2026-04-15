### Gacha System
### Garry Malvin Jiu - 535250077 - TI B
- **Don't forget tambahin localportnya, unedited seharusnya 5000**
- **POST /api/gacha**
  - Localhost:5000/api/gacha
  - Ngepull cuy
  - Body: `{ "userId": "string" }`
  - Response: Prize won or no prize message.
<img width="1919" height="1079" alt="POST Gacha" src="https://github.com/user-attachments/assets/10662151-0066-4eba-8223-581795c37d23" />
  - Seharusnya (yes seharusnya), kalo dirun 5x pake id sama bakal kena block biar gk adiksi
<img width="1919" height="1079" alt="POST Gacha-Rate Limit" src="https://github.com/user-attachments/assets/53fdcd0e-e972-4dc3-950c-822e7e6b695f" />
  - No prize (20% chance)
<img width="1919" height="1079" alt="Gacha no prize" src="https://github.com/user-attachments/assets/0f3c5d1e-ad39-4658-9d84-1b0b0c29e272" />
  - forgot to mention, added gacha rates, so:
  - `Gold: 0.5%, Phone X: 2.5%, Phone Y: 6%, 100k voucher: 15%, 50k voucher: 76%`
- **GET /api/gacha/history?userId=xxxx**
  - Localhost:5000/api/gacha/history?userId=xxxx
  - Get user's gacha history.
  - Query: userId gantiin xxxx, bentuk string
  - Example: Localhost:5000/api/gacha/history?userId=Duxion
  - Response: List of attempts with prizes.
<img width="1919" height="1079" alt="GET history" src="https://github.com/user-attachments/assets/f0b8d8c8-8524-41ca-9e0d-7ae241409ac3" />

- **GET /api/gacha/prizes**
  - Localhost:5000/api/gacha/prizes
  - Get remaining prizes and quotas.
  - Response: List of prizes with remaining counts.
<img width="1919" height="1079" alt="GET prizes" src="https://github.com/user-attachments/assets/bb0cb45b-1993-44f7-8dca-cda80e4b4131" />

- **GET /api/gacha/winners**
  - Localhost:5000/api/gacha/winners
  - Get list of winners with masked names.
  - Response: List of prizes with masked winner names.
  - <img width="1919" height="1079" alt="GET Winners" src="https://github.com/user-attachments/assets/3ded0e37-54ca-475d-b9c3-53807b822e1c" />
