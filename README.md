# Performance Profiling

## Profiling results

### 1. Initial load
- **Components:**
- `App` → 0.7 ms (out of 2.9 ms)
- `Suspense` → 0.5 ms (out of 0.8 ms)
- `Spinner` → 0.1 ms (out of 0.2 ms)
- **Commit duration:** 2.9 ms
- **Render duration (total):** ~1.3 ms
- **Interpretation:** loading is minimally expensive, most of the time is taken by `Suspense`.

---

### 2. Loading data (first render after receiving data)
- **Suspense** → 3.7 ms
- **DataRoot** → 77.7 ms (by 0.5s)
- **DataProvider** → 77.7 ms (0.5s), 82 ms (0.6s), 176.6 ms (31.4s)
- **Context.Provider** → 77.7 ms, 82 ms, 176.6 ms
- **Commit duration:** up to ~176 ms
- **Interpretation:** the most expensive place during initialization is rendering `DataProvider` and `Context.Provider`.

---

### 3. Rendering the country table
- **CountryTable** → 77.7 ms (0.5s), 82 ms (0.6s), 132.4 ms (7.9s), then ~20 more measurements in the range of 70–150 ms
- **Commit duration:** up to ~132 ms
- **Interpretation:** the main source of load. Each table render takes tens of milliseconds, especially when filtering/sorting.

--

## Flame Graph
- The Flame Graph shows that the lion's share of time is spent on `CountryTable` and child elements (`tr`, `td`).
- The contribution of `App`, `Suspense` and `Spinner` is minimal (<1 ms).
- `DataProvider` and `Context.Provider` take a significant amount of time during the first initialization.

---

## Ranked Chart
(by rendering time, based on measurements)
1. `CountryTable` – up to **132 ms**
2. `DataProvider` – up to **176 ms**
3. `Context.Provider` – up to **176 ms**
4. `DataRoot` – ~78 ms
5. `Suspense` – up to 3.7 ms
6. `App` / `Spinner` – less than 1 ms

---

## Conclusions
- The heaviest component is **`CountryTable`**, each render can take >100 ms.

- On first load, context data (`DataProvider`, `Context.Provider`) takes up to **176 ms**.

- Basic components (`App`, `Suspense`, `Spinner`) have virtually no impact on performance.
- With a large number of table rows, searching/sorting leads to long renderings.

## Profiler Screenshots
(performance/screenshots/WithoutUseMemo-1.png)

# Performance Profiling with UseMemo

### Table Rendering (Quick Scenario)
![Table Rendering (27ms)](performance/screenshots/profilier1.png)
The `CountryTable` component took **≈27ms** to render.

### Table Rendering (Full Load)
![Table Rendering (104ms)](performance/screenshots/profilier.png)
With a different data sample, `CountryTable` took **≈105ms** to render.

### Brief Description
- Initial table render: **27–105ms** depending on the amount of data.

- Content updates are smooth, without any noticeable delays.

- The app remains responsive even with repeated renders.

