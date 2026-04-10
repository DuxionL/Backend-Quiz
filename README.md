### Gacha System
### Garry Malvin Jiu - 535250077 - TI B
- **Don't forget tambahin localportnya, unedited seharusnya 5000**
- **POST /api/gacha**
  - Localhost:5000/api/gacha
  - Ngepull cuy
  - Body: `{ "userId": "string" }`
  - Response: Prize won or no prize message.

  - Seharusnya (yes seharusnya), kalo dirun 5x pake id sama bakal kena block biar gk adiksi

- **GET /api/gacha/history?userId=xxxx**
  - Localhost:5000/api/gacha/history?userId=xxxx
  - Get user's gacha history.
  - Query: userId gantiin xxxx, bentuk string
  - Example: Localhost:5000/api/gacha/history?userId=Duxion
  - Response: List of attempts with prizes.

- **GET /api/gacha/prizes**
  - Localhost:5000/api/gacha/prizes
  - Get remaining prizes and quotas.
  - Response: List of prizes with remaining counts.

- **GET /api/gacha/winners**
  - Localhost:5000/api/gacha/winners
  - Get list of winners with masked names.
  - Response: List of prizes with masked winner names.