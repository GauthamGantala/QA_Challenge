<<<<<<< HEAD
# QA Challenge
=======
# QA_Challenge

# 🎯 QA Challenge – Playwright Test Suite

This repository contains an automated UI test suite built with **Playwright + TypeScript** to validate the functionality, layout, and responsiveness of a Rooming List Management web application.

---

## ✅ Test Coverage Summary

| Group                    | Description                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| 🔍 **Search Functionality**     | Verifies search input visibility, usability, result filtering, and no-result handling *(TC01–TC04)* |
| 🧰 **Filter Functionality**     | Validates filter dropdown, option rendering, selection, deselection, and persistence *(TC05–TC11)* |
| 🧾 **Event Card Display**       | Confirms card grouping, RFP details, agreement type, cut-off dates, and booking button presence *(TC12–TC15)* |
| 📋 **Bookings Functionality**  | Opens modal, validates booking entries against backend data *(TC16)* |
| 🖥️ **Layout & Responsiveness** | Tests horizontal scrolling, dropdown alignment, title visibility, and screen resizing *(TC17–TC19, TC23)* |
| 🎨 **Visual & Edge Cases**     | Covers empty states, group separators, and combined filter+search flows *(TC20–TC22)* |

---

## 🧪 Tech Stack

- **Framework**: [Playwright](https://playwright.dev/)
- **Language**: TypeScript
- **Runner**: Playwright Test
- **Reports**: HTML reporter included

---

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn
- Docker (optional, for PostgreSQL)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd qa-challenge
```

2. Install dependencies:

```bash
yarn install
```

3. Start the PostgreSQL database (using Docker):

```bash
yarn setup:db
# Or using Docker Compose
yarn docker-compose:up
```

4. Start the backend:

```bash
yarn backend
```

5. Start the frontend:

```bash
yarn frontend
```

6. Access the application at http://localhost:3000

7. 

```bash
npm install
```

8. 

```bash
npx playwright test
```

9.

```bash
npx playwright show-report
```

## 📂 Project Structure

tests/

├── BookingDetailsVerify.spec.ts        ```TC16```

├── EventCards.spec.ts                  ```TC12–TC15```

├── FiltersFunctionality.spec.ts        ```TC05–TC11```

├── LayoutResponsiveness.spec.ts        ```TC17–TC19, TC23```

├── SearchFunctionality.spec.ts         ```TC01–TC04```

├── VisualEdgesCases.spec.ts            ```TC20–TC22```


# 👤 Author

## Gautham Gantala

QA Engineer/SDET
>>>>>>> 43522631e37a7bf88ce6e1f535a1ada93ee08e29
