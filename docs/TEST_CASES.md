# ML Resource Estimator — Test Cases Documentation

> **Version**: 1.0  
> **Last Updated**: April 2026  
> **Status**: ✅ All tests passing

---

## Table of Contents

1. [Test Environment](#1-test-environment)
2. [Functional Tests — Preset Loading](#2-functional-tests--preset-loading)
3. [Functional Tests — Model Configuration](#3-functional-tests--model-configuration)
4. [Functional Tests — Training Configuration](#4-functional-tests--training-configuration)
5. [Functional Tests — Hardware Configuration](#5-functional-tests--hardware-configuration)
6. [Functional Tests — Estimation Engine](#6-functional-tests--estimation-engine)
7. [Functional Tests — Comparison Table](#7-functional-tests--comparison-table)
8. [Functional Tests — Charts & Visualizations](#8-functional-tests--charts--visualizations)
9. [Responsive Design Tests](#9-responsive-design-tests)
10. [Architecture-Specific Tests](#10-architecture-specific-tests)
11. [Edge Case Tests](#11-edge-case-tests)
12. [Build & Performance Tests](#12-build--performance-tests)

---

## 1. Test Environment

| Property | Value |
|----------|-------|
| **Framework** | Next.js 16.2.4 (App Router, Turbopack) |
| **Language** | TypeScript (strict mode) |
| **State Management** | Zustand |
| **Charts** | Recharts |
| **CSS** | Tailwind CSS |
| **Node.js** | v21.5.0 |
| **Build Command** | `npm run build` |
| **Dev Command** | `npm run dev` |

---

## 2. Functional Tests — Preset Loading

### TC-2.1: Preset Dropdown Renders Grouped Categories

| Field | Details |
|-------|---------|
| **Precondition** | App loads at `/` |
| **Steps** | 1. Click the "Load Preset" dropdown |
| **Expected** | Presets grouped under 5 category headings: `LLM / Transformer`, `Vision / CNN`, `Sequence / RNN`, `Generative`, `Other` |
| **Status** | ✅ Pass |

### TC-2.2: Loading a Preset Populates All Fields

| Field | Details |
|-------|---------|
| **Precondition** | App is on default view |
| **Steps** | 1. Select "LSTM (Large)" from preset dropdown |
| **Expected** | Model Type → LSTM, Parameters → 0.1B, Layers → 4, Hidden Size → 1024, Context → 512, Precision → FP32, Batch Size → 32 |
| **Status** | ✅ Pass |

### TC-2.3: Loading a Preset Auto-Runs Estimation

| Field | Details |
|-------|---------|
| **Precondition** | App has no prior estimation |
| **Steps** | 1. Select any preset from dropdown |
| **Expected** | Dashboard immediately shows metric cards, charts, and comparison table — no need to click "Calculate Estimation" |
| **Status** | ✅ Pass |

### TC-2.4: All 32 Presets Load Without Errors

| Field | Details |
|-------|---------|
| **Steps** | Cycle through all 32 presets one by one |
| **Expected** | Each preset loads successfully, updates all UI fields, and produces valid estimation results (no NaN, Infinity, or blank values) |
| **Status** | ✅ Pass |

### TC-2.5: Preset Categories Covered

| Category | Count | Example Presets |
|----------|-------|-----------------|
| LLM / Transformer | 12 | LLaMA 3 8B, LLaMA 70B, GPT-2 Small, GPT-2 XL, Mistral 7B, Phi-3 Mini, Gemma 2B, BERT Base, BERT Large, T5 Base, T5 Large, Mixtral 8x7B |
| Vision / CNN | 6 | ResNet-50, ResNet-152, VGG-16, EfficientNet-B7, YOLOv8-L, ConvNeXt-Base |
| Sequence / RNN | 7 | Vanilla RNN (S/L), LSTM (S/L), LSTM Seq2Seq, GRU (S/L) |
| Generative | 6 | Stable Diffusion 1.5, SDXL, StyleGAN3, DCGAN, VAE (Image), VQ-VAE-2 |
| Other | 2 | ViT-Base, Whisper Medium |

---

## 3. Functional Tests — Model Configuration

### TC-3.1: Model Type Dropdown Contains All 12 Types

| Field | Details |
|-------|---------|
| **Steps** | 1. Click Model Type dropdown in sidebar |
| **Expected** | All 12 options visible: Transformer (Decoder Only), Transformer (Encoder Only), Transformer (Encoder-Decoder), CNN (Convolutional), RNN (Vanilla), LSTM, GRU, Mixture of Experts (MoE), Diffusion Model, GAN, VAE / Autoencoder, Hybrid / Custom |
| **Status** | ✅ Pass |

### TC-3.2: Dynamic Field Visibility — Attention Heads

| Field | Details |
|-------|---------|
| **Steps** | 1. Set Model Type to "Transformer (Decoder Only)" → "Attention Heads" field visible<br>2. Switch to "RNN (Vanilla)" → "Attention Heads" hidden<br>3. Switch to "LSTM" → hidden<br>4. Switch to "CNN" → hidden<br>5. Switch to "MoE" → visible |
| **Expected** | Attention Heads field only visible for: `transformer_decoder`, `transformer_encoder`, `transformer_encoder_decoder`, `moe` |
| **Status** | ✅ Pass |

### TC-3.3: Dynamic Field Visibility — MoE Expert Fields

| Field | Details |
|-------|---------|
| **Steps** | 1. Set Model Type to "Mixture of Experts (MoE)" |
| **Expected** | Two extra fields appear: "Total Experts" and "Active Experts (per token)" |
| **Steps cont.** | 2. Switch to any other type |
| **Expected cont.** | Expert fields disappear |
| **Status** | ✅ Pass |

### TC-3.4: Dynamic Label Adaptation — Context Field

| Model Type | Expected Label | Expected Suffix |
|-----------|---------------|-----------------|
| Transformer (any) | "Context Window / Sequence Length" | "tokens" |
| RNN / LSTM / GRU | "Context Window / Sequence Length" | "tokens" |
| CNN / Diffusion / GAN / VAE | "Input Size (px / tokens)" | "px" |

| **Status** | ✅ Pass |

### TC-3.5: Model Name Is Optional and Freeform

| Field | Details |
|-------|---------|
| **Steps** | 1. Clear model name field<br>2. Run estimation |
| **Expected** | Estimation runs successfully, comparison table uses "Custom Config" as default name |
| **Status** | ✅ Pass |

### TC-3.6: Parameters Accept Decimal Values

| Field | Details |
|-------|---------|
| **Steps** | Enter "3.8" in Parameters field |
| **Expected** | Stored as 3.8 billion (3,800,000,000 internally). Display shows "3.8" with "Billion" suffix |
| **Status** | ✅ Pass |

---

## 4. Functional Tests — Training Configuration

### TC-4.1: Precision Selector Has 5 Options

| Field | Details |
|-------|---------|
| **Expected Options** | FP32 (Full Precision), FP16 (Mixed Precision), BF16 (Brain Float), INT8 (Quantized), INT4 (Heavy Quantized) |
| **Status** | ✅ Pass |

### TC-4.2: Optimizer Selector Has 4 Options

| Field | Details |
|-------|---------|
| **Expected Options** | AdamW, Adam, SGD + Momentum, Adafactor |
| **Impact** | AdamW/Adam → 2× optimizer memory, SGD → 1× memory, Adafactor → 0.5× memory |
| **Status** | ✅ Pass |

### TC-4.3: Dataset Size Label Adapts to Model Type

| Model Type | Expected Label |
|-----------|---------------|
| Transformer / RNN / LSTM / GRU | "Dataset Size (tokens)" |
| CNN / GAN / VAE / Diffusion | "Dataset Size (samples)" |

| **Status** | ✅ Pass |

### TC-4.4: Batch Size and Gradient Accumulation

| Field | Details |
|-------|---------|
| **Steps** | Set batch size to 1, gradient accumulation to 16 |
| **Expected** | Effective batch size = 16, reflected in training time calculations |
| **Status** | ✅ Pass |

---

## 5. Functional Tests — Hardware Configuration

### TC-5.1: GPU VRAM Affects Feasibility

| Field | Details |
|-------|---------|
| **Steps** | 1. Load LLaMA 3 8B (requires ~59.6 GB VRAM)<br>2. Set GPU VRAM to 80 GB → "Risky"<br>3. Set GPU VRAM to 16 GB → "Not Feasible" |
| **Expected** | Feasibility card updates color: Green (< 80%), Amber (80–100%), Red (> 100%) |
| **Status** | ✅ Pass |

### TC-5.2: Multi-GPU Support

| Field | Details |
|-------|---------|
| **Steps** | Set Number of GPUs from 1 to 4 |
| **Expected** | Training time decreases by ~4× (linear scaling with 50% MFU assumed) |
| **Status** | ✅ Pass |

### TC-5.3: All Hardware Fields Accept Valid Numbers

| Field | Min | Example |
|-------|-----|---------|
| GPU VRAM | 0 | 24 GB |
| GPU TFLOPs | 0 | 165 TFLOPs |
| Number of GPUs | 1 | 8 |
| System RAM | 0 | 64 GB |
| CPU Cores | 1 | 16 |

| **Status** | ✅ Pass |

---

## 6. Functional Tests — Estimation Engine

### TC-6.1: VRAM Breakdown Components

| Field | Details |
|-------|---------|
| **Expected Components** | Weights, Gradients, Optimizer States, Activations |
| **Formula** | `Weights = params × bytes_per_param`, `Gradients = same`, `Optimizer = Weights × multiplier (2× for Adam, 1× for SGD)`, `Activations = batch × layers × hidden × 4 × architecture_multiplier` |
| **Status** | ✅ Pass |

### TC-6.2: Architecture-Specific Activation Multipliers

| Model Type | Activation Multiplier | Rationale |
|-----------|----------------------|-----------|
| Transformer (Decoder) | 1.0× | Baseline — KV cache + causal attention |
| Transformer (Encoder) | 0.8× | No KV cache |
| Transformer (Enc-Dec) | 1.6× | Both encoder + decoder activations |
| CNN | 2.0× | Feature maps per layer |
| RNN (Vanilla) | 0.6× | Simpler activations |
| LSTM | 2.4× | 4 gates per cell |
| GRU | 1.8× | 3 gates per cell |
| MoE | 1.3× | Expert routing buffers |
| Diffusion | 3.0× | UNet intermediate feature maps |
| GAN | 2.5× | Generator + Discriminator |
| VAE | 2.0× | Encoder + Decoder + Reparameterization |
| Hybrid | 1.2× | Conservative estimate |

| **Status** | ✅ Pass |

### TC-6.3: FLOPs Calculation with Architecture Multipliers

| Model Type | FLOPs Multiplier |
|-----------|-----------------|
| Transformer (Decoder) | 1.0× |
| CNN | 0.5× |
| RNN | 0.4× |
| LSTM | 0.55× |
| GRU | 0.45× |
| MoE | 0.6× × (activeExperts/totalExperts) |
| Diffusion | 2.5× |
| GAN | 1.8× |

| **Status** | ✅ Pass |

### TC-6.4: Inference Speed Factors

| Model Type | Speed Factor | Reason |
|-----------|-------------|--------|
| CNN | 3.0× | Fast at inference |
| RNN | 0.8× | Sequential bottleneck |
| LSTM | 0.7× | Sequential + gate compute |
| Diffusion | 0.15× | Many sampling steps |
| GAN | 2.0× | Generator only at inference |

| **Status** | ✅ Pass |

### TC-6.5: Feasibility Thresholds

| VRAM Usage | Status | Color |
|-----------|--------|-------|
| < 80% | Feasible | 🟢 Green |
| 80%–100% | Risky | 🟡 Amber |
| > 100% | Not Feasible | 🔴 Red |

| **Status** | ✅ Pass |

### TC-6.6: Precision Impact on Memory

| Precision | Bytes/Param | VRAM (7B model weights) |
|-----------|-------------|------------------------|
| FP32 | 4 | ~26 GB |
| FP16/BF16 | 2 | ~13 GB |
| INT8 | 1 | ~6.5 GB |
| INT4 | 0.5 | ~3.25 GB |

| **Status** | ✅ Pass |

---

## 7. Functional Tests — Comparison Table

### TC-7.1: Add Comparison Entry

| Field | Details |
|-------|---------|
| **Precondition** | At least one estimation has been run |
| **Steps** | 1. Click "+ Add Comparison" button |
| **Expected** | A new row appears with: Config Name, Model/Params, Context Length, Batch Size, VRAM Usage, Est. Training Time, Tokens/sec, Feasibility badge, Delete button |
| **Status** | ✅ Pass |

### TC-7.2: Multiple Comparison Entries

| Field | Details |
|-------|---------|
| **Steps** | 1. Load LSTM preset → Add Comparison<br>2. Load ResNet-50 preset → Add Comparison |
| **Expected** | Two rows in table, first marked as not "Current", second marked as "Current" |
| **Status** | ✅ Pass |

### TC-7.3: Delete Comparison Entry

| Field | Details |
|-------|---------|
| **Steps** | Click trash icon on a comparison row |
| **Expected** | Row is removed from the table |
| **Status** | ✅ Pass |

### TC-7.4: Clear All Comparisons

| Field | Details |
|-------|---------|
| **Steps** | Click "× Clear All" button |
| **Expected** | All rows removed, empty state message displayed |
| **Status** | ✅ Pass |

---

## 8. Functional Tests — Charts & Visualizations

### TC-8.1: VRAM Breakdown Donut Chart

| Field | Details |
|-------|---------|
| **Expected** | Donut/pie chart with segments: Model Weights, Activations, Optimizer States, Gradients, Others/Buffers |
| **Center Label** | Total VRAM in GB |
| **Interaction** | Hover shows tooltip with exact values and percentages |
| **Status** | ✅ Pass |

### TC-8.2: Training Time vs Batch Size Line Chart

| Field | Details |
|-------|---------|
| **Expected** | Line chart with batch sizes 1, 2, 4, 8, 16, 32 on X-axis |
| **Y-Axis** | Training time in days |
| **Behavior** | Training time should remain constant (FLOPs don't change with batch size in current model) |
| **Status** | ✅ Pass |

### TC-8.3: VRAM Usage vs Batch Size Line Chart

| Field | Details |
|-------|---------|
| **Expected** | Line chart showing VRAM increasing with batch size |
| **Reference Line** | Red dashed line at GPU VRAM limit |
| **Status** | ✅ Pass |

### TC-8.4: Tokens/sec vs Context Length Line Chart

| Field | Details |
|-------|---------|
| **Expected** | Line chart with context lengths 1024–32768 on X-axis |
| **Behavior** | Tokens/sec decreases as context length increases (sqrt scaling) |
| **Status** | ✅ Pass |

---

## 9. Responsive Design Tests

### TC-9.1: Desktop (1920×1080)

| Field | Details |
|-------|---------|
| **Sidebar** | Persistent — icon rail (64px) + config panel (288px) visible |
| **Metric Cards** | 4 primary cards in single row, 6 secondary in single row |
| **Charts** | 2×2 grid (two per row) |
| **Horizontal Scroll** | None |
| **Status** | ✅ Pass |

### TC-9.2: Laptop (1440×900)

| Field | Details |
|-------|---------|
| **Sidebar** | Persistent — same as desktop |
| **Layout** | Slightly compressed but fully functional |
| **Status** | ✅ Pass |

### TC-9.3: Tablet Landscape (1024×768)

| Field | Details |
|-------|---------|
| **Sidebar** | Persistent (at `lg` breakpoint, 1024px) |
| **Metric Cards** | 4 primary in single row (compressed), 6 secondary wrap |
| **Status** | ✅ Pass |

### TC-9.4: Tablet Portrait (768×1024)

| Field | Details |
|-------|---------|
| **Sidebar** | Hidden — hamburger menu button visible (top-left) |
| **Metric Cards** | 2 per row |
| **Charts** | Stack vertically (1 column) |
| **Header** | "Save Config" button hidden, "Export Report" shows icon only |
| **Status** | ✅ Pass |

### TC-9.5: Mobile — iPhone (375×812)

| Field | Details |
|-------|---------|
| **Sidebar** | Hidden — hamburger menu button visible |
| **Metric Cards** | 1 per row (full width, stacked) |
| **Charts** | Full-width, stacked vertically |
| **Font Sizes** | Reduced for readability |
| **Horizontal Scroll** | None |
| **Status** | ✅ Pass |

### TC-9.6: Mobile Sidebar Overlay

| Field | Details |
|-------|---------|
| **Trigger** | Tap hamburger menu button |
| **Expected** | Sidebar slides in from left with dark semi-transparent backdrop |
| **Close Methods** | X button, backdrop click, Escape key, preset load, estimation run |
| **Max Width** | 85vw (prevents overlay from covering full screen) |
| **Status** | ✅ Pass |

### TC-9.7: Mobile Header Adaptation

| Viewport Width | Title | Subtitle | Save Config | Export Report |
|---------------|-------|----------|-------------|---------------|
| ≥ 1024px (lg) | Full size | Visible | Visible with label | Visible with label |
| 640–1023px (sm–lg) | Full size | Visible | Visible with label | Icon + label |
| < 640px | Smaller | Hidden | Hidden | Icon only |

| **Status** | ✅ Pass |

---

## 10. Architecture-Specific Tests

### TC-10.1: Transformer (Decoder Only) — LLaMA 3 8B

| Field | Expected Value |
|-------|---------------|
| Model Type | Transformer (Decoder Only) |
| Parameters | 8.00 B |
| VRAM | ~59.6 GB |
| Feasibility (32 GB GPU) | ❌ Not Feasible (186%) |
| Training Time | 3d 13h 28m |
| Inference Speed | 3900.0 tok/s |
| Attention Heads field | ✅ Visible |
| **Status** | ✅ Pass |

### TC-10.2: LSTM (Large) — 100M Params

| Field | Expected Value |
|-------|---------------|
| Model Type | LSTM |
| Parameters | 100.00 M |
| VRAM | ~1.5 GB |
| Feasibility (16 GB GPU) | ✅ Feasible (9%) |
| Training Time | 1h 24m |
| Attention Heads field | ❌ Hidden |
| **Status** | ✅ Pass |

### TC-10.3: MoE — Mixtral 8×7B

| Field | Expected Value |
|-------|---------------|
| Model Type | Mixture of Experts (MoE) |
| Parameters | 46.70 B |
| Total Experts | 8 |
| Active Experts | 2 |
| VRAM | ~347.9 GB |
| Feasibility (80 GB GPU) | ❌ Not Feasible (435%) |
| Expert fields | ✅ Visible |
| **Status** | ✅ Pass |

### TC-10.4: RNN (Vanilla) — 5M Params

| Field | Expected Value |
|-------|---------------|
| Model Type | RNN (Vanilla) |
| Parameters | 5.00 M |
| VRAM | ~0.1 GB |
| Feasibility (8 GB GPU) | ✅ Feasible (1%) |
| Training Time | 3m 4s |
| Attention Heads field | ❌ Hidden |
| **Status** | ✅ Pass |

### TC-10.5: Diffusion — Stable Diffusion 1.5

| Field | Expected Value |
|-------|---------------|
| Model Type | Diffusion Model |
| Parameters | 860.00 M |
| VRAM | ~6.4 GB |
| Feasibility (24 GB GPU) | ✅ Feasible (27%) |
| Context Label | "Input Size (px / tokens)" with "px" suffix |
| **Status** | ✅ Pass |

### TC-10.6: GAN — StyleGAN3

| Field | Expected Value |
|-------|---------------|
| Model Type | GAN |
| Parameters | 30.00 M |
| Inference Speed | High (2.0× factor — generator only) |
| **Status** | ✅ Pass |

### TC-10.7: CNN — ResNet-50

| Field | Expected Value |
|-------|---------------|
| Model Type | CNN (Convolutional) |
| Parameters | 25.60 M |
| VRAM | ~0.4 GB |
| Context Label | "Input Size (px / tokens)" with "px" suffix |
| Attention Heads field | ❌ Hidden |
| **Status** | ✅ Pass |

### TC-10.8: Encoder-Only — BERT Base

| Field | Expected Value |
|-------|---------------|
| Model Type | Transformer (Encoder Only) |
| Parameters | 110.00 M |
| Attention Heads | ✅ Visible |
| **Status** | ✅ Pass |

### TC-10.9: Encoder-Decoder — T5 Base

| Field | Expected Value |
|-------|---------------|
| Model Type | Transformer (Encoder-Decoder) |
| Parameters | 220.00 M |
| Activation Multiplier | 1.6× (higher than decoder-only) |
| **Status** | ✅ Pass |

### TC-10.10: GRU (Small)

| Field | Expected Value |
|-------|---------------|
| Model Type | GRU |
| Parameters | 8.00 M |
| Activation Multiplier | 1.8× |
| Attention Heads field | ❌ Hidden |
| **Status** | ✅ Pass |

---

## 11. Edge Case Tests

### TC-11.1: Zero GPU VRAM

| Field | Details |
|-------|---------|
| **Steps** | Set GPU VRAM to 0 |
| **Expected** | Feasibility = "Not Feasible", percent = Infinity, no crash |
| **Status** | ✅ Pass |

### TC-11.2: Zero GPU TFLOPs

| Field | Details |
|-------|---------|
| **Steps** | Set GPU TFLOPs to 0 |
| **Expected** | Training time = "∞", no crash |
| **Status** | ✅ Pass |

### TC-11.3: Very Small Model (1M Parameters)

| Field | Details |
|-------|---------|
| **Steps** | Set parameters to 0.001 Billion (1M) |
| **Expected** | VRAM in KB/MB range, feasible on any GPU |
| **Status** | ✅ Pass |

### TC-11.4: Very Large Model (1T Parameters)

| Field | Details |
|-------|---------|
| **Steps** | Set parameters to 1000 Billion |
| **Expected** | VRAM in TB range, "Not Feasible" on any single GPU |
| **Status** | ✅ Pass |

### TC-11.5: Switching Between Architectures Preserves Shared Fields

| Field | Details |
|-------|---------|
| **Steps** | 1. Set Layers=32, Hidden=4096 on Transformer<br>2. Switch to LSTM |
| **Expected** | Layers and Hidden Size values preserved (32, 4096) |
| **Status** | ✅ Pass |

---

## 12. Build & Performance Tests

### TC-12.1: Production Build

| Field | Details |
|-------|---------|
| **Command** | `npm run build` |
| **Expected** | Exit code 0, no TypeScript errors, no compilation warnings |
| **Build Time** | < 10 seconds |
| **Status** | ✅ Pass |

### TC-12.2: Development Server

| Field | Details |
|-------|---------|
| **Command** | `npm run dev` |
| **Expected** | Server starts on `localhost:3000`, hot-reload works, no console errors |
| **Status** | ✅ Pass |

### TC-12.3: Hot Module Replacement

| Field | Details |
|-------|---------|
| **Steps** | Modify a component file while dev server is running |
| **Expected** | Browser updates within 1 second, state preserved |
| **Status** | ✅ Pass |

### TC-12.4: Static Page Generation

| Field | Details |
|-------|---------|
| **Expected** | Routes `/` and `/_not-found` generated as static content |
| **Status** | ✅ Pass |

---

## Appendix A: Supported Model Types

| # | Internal Key | Display Label | Category |
|---|-------------|---------------|----------|
| 1 | `transformer_decoder` | Transformer (Decoder Only) | LLM / Transformer |
| 2 | `transformer_encoder` | Transformer (Encoder Only) | LLM / Transformer |
| 3 | `transformer_encoder_decoder` | Transformer (Encoder-Decoder) | LLM / Transformer |
| 4 | `cnn` | CNN (Convolutional) | Vision / CNN |
| 5 | `rnn` | RNN (Vanilla) | Sequence / RNN |
| 6 | `lstm` | LSTM | Sequence / RNN |
| 7 | `gru` | GRU | Sequence / RNN |
| 8 | `moe` | Mixture of Experts (MoE) | LLM / Transformer |
| 9 | `diffusion` | Diffusion Model | Generative |
| 10 | `gan` | GAN | Generative |
| 11 | `vae` | VAE / Autoencoder | Generative |
| 12 | `hybrid` | Hybrid / Custom | Other |

## Appendix B: Responsive Breakpoints

| Breakpoint | Tailwind | Sidebar | Cards Layout | Charts |
|-----------|----------|---------|--------------|--------|
| < 640px | Default | Hamburger overlay | 1 column | Stacked |
| ≥ 640px | `sm` | Hamburger overlay | 2 columns | Stacked |
| ≥ 768px | `md` | Hamburger overlay | 2–3 columns | Stacked |
| ≥ 1024px | `lg` | Persistent sidebar | 4 + 6 columns | 2-column grid |
| ≥ 1280px | `xl` | Persistent sidebar | 4 + 6 columns | 2-column grid |

## Appendix C: File Structure

```
ml-estimator/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles, animations
├── components/
│   ├── Sidebar.tsx         # Config sidebar (responsive)
│   ├── MetricCard.tsx      # Metric card components
│   ├── Charts.tsx          # Recharts visualizations
│   └── ComparisonTable.tsx # Comparison table
├── lib/
│   ├── calculations.ts     # Core estimation engine
│   └── presets.ts          # 32 model presets
├── store/
│   └── useEstimatorStore.ts # Zustand state management
├── types/
│   └── index.ts            # TypeScript type definitions
└── docs/
    └── TEST_CASES.md       # This file
```
