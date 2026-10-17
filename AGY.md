# @ostro/server — Antigravity AI Architecture & Knowledge Base

> **Package Name**: `@ostro/server`
> **Version**: `2.0.0-alpha.1`
> **Role in Ecosystem**: Modular Core Framework Library

---

## 1. Package Purpose & Overview
Standalone HTTP/HTTPS server adapter and multi-process server cluster runner.

- **Primary Architectural Patterns**: Server engine adapter, request/response delegator, graceful termination.
- **Key Exported Entities**: `Server`, `AdapterServer`, `LambdaSimulator`

---

## 2. Dependencies & Interoperability
- **Direct Dependencies**:
  - `@ostro/support`: `^1.0.2`
  - `@ostro/contracts`: `^1.1.4`
  - `finalhandler`: `^1.1.2`
- **Framework Consumers**: Consumed across the OstroJS ecosystem via `@ostro/framework` and direct imports.

---

## 3. Directory & Source Layout
```text
origin/server/
├── adapter/server.ts
├── adapter/serverless.ts
├── server.ts
├── serverless/eventBuilder.ts
├── serverless/lambdaSimulator.ts
├── serverless/lambdaWorker.ts
├── serverless/responseSender.ts
├── serverless/strategies/forkStrategy.ts
├── serverless/strategies/processStrategy.ts
├── serverless/strategies/threadStrategy.ts
├── serverless/strategies/vmStrategy.ts
├── utils.ts
```

---

## 4. TypeScript Typing & Code Standards
1. **Access Modifiers**: All class properties and methods declare explicit visibility (`public`, `protected`, `private`).
2. **Inheritance & Overrides**: Classes overriding base class methods use the `override` keyword to safeguard contracts.
3. **Immutability**: Constant lookup tables and static registries use `readonly` and strict record types.
4. **No Implicit Any**: Public APIs avoid `any` in favor of generics (`<T = unknown>`) and typed contracts from `@ostro/contracts`.
5. **Contract Binding**: Core managers implement contracts from `@ostro/contracts/server/*`.

---

## 5. Development & Verification Guide
- **Compile / Build**: `npm run build` (runs `npx tsc -p tsconfig.build.json`)
- **Run Tests**: `npm test` (executes Jest with 100% coverage target via `c8`)
- **Published Artifacts**: Target output compiled to `./build` with accompanying `.d.ts` declarations and source maps.

---
*Generated for Antigravity AI high-speed codebase comprehension with minimal token consumption.*
