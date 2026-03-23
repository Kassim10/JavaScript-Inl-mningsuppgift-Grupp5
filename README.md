# To-Do List Application

Detta projekt är en dynamisk To-Do applikation byggd med Vanilla JavaScript, HTML och CSS.  
Applikationen gör det möjligt för användaren att skapa, visa och hantera sina uppgifter på ett enkelt och intuitivt sätt.

## Syfte

Syftet med applikationen är att hjälpa användaren att planera sin dag genom att hålla koll på uppgifter som behöver göras.

## Funktioner

- Lägg till nya uppgifter
- Visa alla uppgifter i en lista
- Ta bort enskilda uppgifter
- Rensa alla uppgifter
- Förhindra tomma uppgifter
- Förhindra duplicerade uppgifter
- Spara uppgifter i localStorage (datan finns kvar vid reload)
- Visa felmeddelanden i modal

## Tekniker

- HTML
- CSS
- JavaScript (ES6 modules)
- LocalStorage
- Vitest (för testning)
- Happy DOM (testmiljö)

## TDD (Test Driven Development)

Vi har använt Test Driven Development (TDD) för att testa delar av applikationen.

TDD innebär att:
1. Man skriver tester först
2. Sedan implementerar funktionalitet
3. Till sist refaktorerar koden

I detta projekt testas funktioner i JavaScript med hjälp av Vitest.

### Exempel på vad som testas:
- Validering av input
- Funktioners beteende


## Installation

1. Klona projektet: git clone <repo-url>
2. Installera dependencies: npm install


## Starta projektet

Öppna `index.html` i webbläsaren.

## Köra tester

Kör tester en gång: npm run 

Kör tester i watch mode: npm run test:watch

Kör tester med coverage: npm run test:coverage


## Hur vi byggde lösningen

Applikationen är uppbyggd modulärt där logik, DOM-manipulation och lagring är separerade i olika filer.

- `script.js` → hanterar logik och events
- `dom.js` → skapar HTML-element dynamiskt
- localStorage → används för att spara data

All rendering av listan sker dynamiskt via JavaScript.

## Grupparbete

Projektet är utvecklat som en gruppuppgift där vi samarbetat kring:
- Design av UI
- Struktur av kod
- Funktionalitet
- Testning