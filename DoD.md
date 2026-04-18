# ✅ Definition of Done (DoD) — Anson Precision

> Mỗi task được coi là **DONE** khi và chỉ khi **tất cả** tiêu chí nghiệm thu bên dưới đều đạt.
> Tiêu chí được thiết kế để **đo lường được** (measurable), không mơ hồ.

---

## Quy ước ký hiệu

| Ký hiệu | Loại kiểm tra |
|----------|---------------|
| 🧪 | Test tự động hoặc thủ công có thể lặp lại |
| 👁️ | Kiểm tra bằng mắt trên UI |
| 🔌 | Kiểm tra API endpoint (curl/Postman/httpie) |
| 💾 | Kiểm tra dữ liệu trong Database/ChromaDB |
| 📄 | Kiểm tra file/code tồn tại và đúng cấu trúc |

---

## PHASE 1 — Nền Tảng Hạ Tầng

### 1.1 Monorepo FE/BE ✅ DONE

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Thư mục `frontend/` chứa toàn bộ React code, `backend/` chứa FastAPI code | 📄 `ls frontend/src/App.tsx` và `ls backend/app/main.py` đều tồn tại |
| 2 | `cd frontend && npm run dev` khởi động được trên port 3000 | 🧪 Truy cập `http://localhost:3000` trả về HTML |
| 3 | `cd backend && uvicorn app.main:app` khởi động được trên port 8000 | 🧪 Truy cập `http://localhost:8000` trả về JSON |
| 4 | `.gitignore` cập nhật cho cả FE lẫn BE (node_modules, __pycache__, .env, data/) | 📄 Kiểm tra nội dung file |
| 5 | Không còn file source code rác ở thư mục root (chỉ có README, .gitignore, docker-compose) | 📄 `ls` root chỉ có: `frontend/`, `backend/`, `README.md`, `.gitignore`, `docker-compose.yml` |

---

### 1.2 Backend Skeleton

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | `backend/app/main.py` tồn tại, chạy được bằng `uvicorn app.main:app --reload` | 🧪 Không có lỗi import, server start thành công |
| 2 | CORS được cấu hình cho phép `http://localhost:3000` | 🔌 `curl -H "Origin: http://localhost:3000" http://localhost:8000/api/health` trả về header `Access-Control-Allow-Origin` |
| 3 | Endpoint `GET /api/health` trả về `{"status": "ok", "version": "0.1.0"}` | 🔌 Status code 200, body đúng format |
| 4 | Swagger docs tự động tại `/docs` hiển thị được | 👁️ Mở browser `http://localhost:8000/docs` thấy Swagger UI |

---

### 1.3 Database Schema

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | File `backend/app/db/models.py` định nghĩa SQLAlchemy models cho: `Project`, `Template`, `Document`, `DocNode`, `TraceabilityLink` | 📄 File tồn tại, mỗi class có đủ fields theo thiết kế |
| 2 | Bảng `projects` có cột: `id, name, description, domain, status, created_at, updated_at` | 💾 `sqlite3 data/anso.db ".schema projects"` hiển thị đúng |
| 3 | Bảng `traceability_links` có cột: `id, source_node_id, target_node_id, link_type, created_at` | 💾 Schema check |
| 4 | Khi khởi động app lần đầu, DB file `data/anso.db` được tự động tạo | 🧪 Xóa file DB, restart app, file xuất hiện lại |
| 5 | Migration script hoặc `create_all()` chạy không lỗi | 🧪 Không có exception khi start |

---

### 1.4 CRUD API

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | `POST /api/projects` tạo được project mới, trả về `201` + object có `id` | 🔌 curl test với JSON body |
| 2 | `GET /api/projects` trả về list, có pagination (`?page=1&size=10`) | 🔌 Response có `items[]`, `total`, `page` |
| 3 | `GET /api/projects/{id}` trả về 1 project hoặc `404` nếu không tìm thấy | 🔌 Test cả happy path lẫn 404 |
| 4 | `PUT /api/projects/{id}` cập nhật thành công, trả về object mới | 🔌 Field thay đổi đúng |
| 5 | `DELETE /api/projects/{id}` xóa thành công, `GET` lại trả `404` | 🔌 Xóa → verify không còn |
| 6 | Tương tự 5 endpoint trên cho `Templates` | 🔌 Đủ 10 endpoints hoạt động |
| 7 | Validation: tạo project thiếu `name` → trả `422 Unprocessable Entity` | 🔌 Test body thiếu required field |

---

### 1.5 Frontend Refactor

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | `App.tsx` không còn hardcoded `useState` cho `projects[]` và `templates[]` | 📄 Grep: không có mock data array trong App.tsx |
| 2 | Trang Projects gọi `GET /api/projects` khi mount, hiển thị data từ API | 👁️ Mở DevTools Network tab, thấy request tới `:8000` |
| 3 | Tạo Project mới trên UI → gọi `POST /api/projects` → refresh list hiển thị project mới | 👁️ + 💾 Kiểm tra cả UI lẫn DB |
| 4 | Xóa Project trên UI → gọi `DELETE` → project biến mất khỏi list | 👁️ |
| 5 | Khi Backend offline, UI hiển thị error message thân thiện (không crash trắng) | 👁️ Tắt backend, reload FE |

---

### 1.6 Chạy thử E2E

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | FE (port 3000) + BE (port 8000) chạy đồng thời không conflict | 🧪 Cả 2 terminal chạy song song |
| 2 | Tạo Project trên FE → dữ liệu xuất hiện trong SQLite DB → reload FE → data vẫn còn | 🧪 Full round-trip test |
| 3 | Không có lỗi CORS trong Console | 👁️ DevTools Console sạch |

---

## PHASE 2 — AI Engine

### 2.1 LLM Factory

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | `LLMFactory.get_llm("ollama", "qwen2.5:32b")` trả về Ollama client instance | 🧪 Unit test |
| 2 | `LLMFactory.get_llm("gemini", "gemini-2.5-flash")` trả về Gemini client instance (cần `GEMINI_API_KEY`) | 🧪 Unit test |
| 3 | `LLMFactory.get_llm("invalid", "xxx")` raise `ValueError` rõ ràng | 🧪 Unit test |
| 4 | Provider và model name được log ra console khi khởi tạo | 🧪 Kiểm tra stdout |

---

### 2.2 Ollama Provider

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Gọi `POST /api/generate` với `{"provider": "ollama", "model": "qwen2.5:32b", "prompt": "Xin chào"}` → trả về text response | 🔌 curl test, response body có nội dung tiếng Việt |
| 2 | Nếu Ollama server offline → trả `503 Service Unavailable` với message rõ ràng | 🔌 Tắt Ollama, gọi API |
| 3 | Nếu model chưa pull → trả `404` với hướng dẫn `ollama pull <model>` | 🔌 Gọi model không tồn tại |

---

### 2.3 Gemini Provider

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Gọi `POST /api/generate` với `{"provider": "gemini", ...}` → trả về text response | 🔌 curl test |
| 2 | Nếu `GEMINI_API_KEY` rỗng → trả `401` với message "API key chưa cấu hình" | 🔌 Xóa key, gọi API |
| 3 | Nếu key hết quota → trả `429` với message "Vượt quota" | 🔌 Dùng key hết hạn |

---

### 2.4 SSE Streaming

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | `POST /api/generate/stream` trả response với `Content-Type: text/event-stream` | 🔌 curl kiểm tra header |
| 2 | Tokens được gửi từng phần (chunk), không đợi sinh xong mới trả | 🔌 `curl --no-buffer` thấy text hiện dần |
| 3 | Khi generation xong, stream gửi event `[DONE]` và đóng connection | 🔌 Kiểm tra event cuối |
| 4 | Frontend (`AIWorkspaceView`) hiển thị text typing effect (từng ký tự/từ hiện dần) | 👁️ Xem UI |

---

### 2.5 Settings UI

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Trang Settings có dropdown "AI Provider" với 2 option: Ollama, Gemini | 👁️ |
| 2 | Khi chọn Ollama → dropdown "Model" hiển thị danh sách model local (gọi `GET /api/models/ollama`) | 👁️ + 🔌 |
| 3 | Khi chọn Gemini → dropdown "Model" hiển thị danh sách Gemini models (hardcoded) | 👁️ |
| 4 | Lựa chọn được persist (localStorage hoặc API) → reload trang vẫn giữ nguyên | 🧪 Reload test |

---

## PHASE 3 — Template Shredder

### 3.1 Template Node Schema

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Bảng `template_nodes` tồn tại với cột: `id, template_id, parent_id, section_name, section_order, field_type, description, is_required` | 💾 Schema check |
| 2 | Có thể biểu diễn cấu trúc cây (parent → children) cho BRD gồm ít nhất 3 cấp (Chapter → Section → Field) | 💾 Insert test data, query tree |
| 3 | API `GET /api/templates/{id}/tree` trả về JSON dạng cây nested | 🔌 Response có `children[]` nested |

---

### 3.2 Template Parser Service

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | `POST /api/templates/parse` nhận raw text của template mẫu → trả về cây JSON | 🔌 Gửi nội dung BRD template mẫu (text), nhận lại tree structure |
| 2 | Mỗi node trong tree có `section_name`, `description`, `field_type` (text/list/table) | 🔌 Kiểm tra từng node |
| 3 | Template BRD mẫu phải parse ra ≥ 5 sections (VD: Giới thiệu, Phạm vi, Stakeholders, Yêu cầu, Ràng buộc) | 🔌 Đếm nodes |
| 4 | Kết quả parse được lưu vào DB `template_nodes` | 💾 Query DB sau khi parse |

---

### 3.3 Semantic Chunking

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | `POST /api/chunks/process` nhận raw requirements text → trả về danh sách chunks | 🔌 |
| 2 | Mỗi chunk có: `text`, `metadata.type` (actor/feature/constraint/api/nonfunctional), `metadata.tags[]` | 🔌 Kiểm tra structure |
| 3 | Chunks không bị cắt giữa câu (mỗi chunk là một đơn vị ngữ nghĩa hoàn chỉnh) | 🧪 Đọc từng chunk, verify ý nghĩa trọn vẹn |
| 4 | Raw text 1000 từ → sinh ra 5-15 chunks (không quá nhỏ, không quá lớn) | 🔌 Đếm chunks |

---

### 3.4 Embedding & Store

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Sau khi chunking, mỗi chunk được embed thành vector (dimension = model output dim, VD: 768) | 💾 Query ChromaDB collection `project_docs`, kiểm tra embeddings không null |
| 2 | Metadata (`type`, `tags`, `project_id`, `source_doc_id`) được lưu kèm trong ChromaDB | 💾 `collection.get(where={"project_id": "xxx"})` trả kết quả |
| 3 | Query similarity: search "thanh toán" → trả về chunks liên quan đến payment | 💾 Semantic search test |
| 4 | Metadata filter: `where={"type": "feature"}` chỉ trả chunks loại feature | 💾 Filter test |

---

### 3.5 Upload UI

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Có textarea/upload zone cho user paste raw requirements text | 👁️ |
| 2 | Bấm "Phân tích" → loading indicator → hiển thị danh sách chunks dạng card | 👁️ |
| 3 | Mỗi chunk card hiển thị: text preview, type badge (màu), tags | 👁️ |
| 4 | User có thể xóa/sửa type của chunk trước khi confirm lưu | 👁️ Sửa type → bấm Lưu → reload → type mới vẫn đúng |

---

## PHASE 4 — V-Model, Clarification & Document Generation

### 4.1 Traceability Matrix

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Bảng `traceability_links` hoạt động: Insert link `SRS_Node_X → BRD_Node_Y` thành công | 💾 |
| 2 | API `GET /api/traceability/{doc_id}` trả về tất cả links của document đó | 🔌 |
| 3 | Mỗi link có `source_version` và `target_version` → khi version thay đổi, link bị đánh dấu `stale=true` | 💾 Update version → check stale flag |

---

### 4.2 V-Model Dependency Rules

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | File config `dependency_rules.json` hoặc DB table định nghĩa: `{doc_type: "SRS", requires: ["BRD"]}`, `{doc_type: "Test Plan", requires: ["SAD", "HLD"]}` | 📄 File/DB tồn tại |
| 2 | API `GET /api/rules/dependencies?doc_type=SRS` trả về `["BRD"]` | 🔌 |
| 3 | Khi user chọn tạo SRS mà chưa có BRD nào → API trả `400` với message "Cần tạo BRD trước" | 🔌 |

---

### 4.2b HLD Stub Generator

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Khi SAD được tạo/approved → hệ thống tự động trigger tạo HLD Stub | 💾 Sau khi approve SAD, query DB có record HLD Stub mới |
| 2 | HLD Stub cho mỗi component gồm 3 phần: API Surface, Data Flow, Module Boundary | 🔌 `GET /api/documents/{hld_id}` kiểm tra 3 sections |
| 3 | **API Surface** chứa: endpoint path, HTTP method, input schema, output schema | 🔌 Mỗi entry có đủ 4 fields |
| 4 | **Data Flow** chứa: source component, target component, data payload description | 🔌 Mỗi entry có đủ 3 fields |
| 5 | **Module Boundary** chứa: module name, "xử lý" list, "KHÔNG xử lý" list | 🔌 Cả 2 list đều non-empty |
| 6 | Mỗi HLD node có `traceability_link` trỏ ngược về SAD component node nguồn | 💾 Query links |
| 7 | Khi SAD component bị sửa → HLD Stub tương ứng bị đánh dấu `stale` | 💾 Update SAD node → check HLD stale flag |

---

### 4.4 Context Sufficiency Check

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | API `POST /api/generate/check-context` nhận `{template_id, source_doc_ids}` → trả `{sufficient: bool, gaps: [...], coverage_estimate: float}` | 🔌 |
| 2 | Khi đủ context: `sufficient=true`, `gaps=[]` | 🔌 Gửi đầy đủ sources |
| 3 | Khi thiếu: `sufficient=false`, `gaps` chứa ít nhất 1 mô tả cụ thể (VD: "Thiếu thông tin về authentication method") | 🔌 Gửi BRD nhưng thiếu SRS khi tạo Test Plan |
| 4 | Response time < 10 giây (chỉ là analysis, không phải full generation) | 🧪 Đo thời gian |

---

### 4.5 Clarification Q&A Generator

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Khi `sufficient=false`, API trả thêm `questions[]` bên cạnh `gaps[]` | 🔌 |
| 2 | Mỗi question có: `id`, `text`, `type` (multiple_choice/open_ended), `options[]` (nếu multiple choice) | 🔌 Kiểm tra structure |
| 3 | Questions phải liên quan trực tiếp đến `gaps` (không hỏi linh tinh) | 🧪 Đọc questions, verify liên quan đến gap |
| 4 | Số lượng questions: 2-8 câu (không quá ít, không quá nhiều) | 🔌 Đếm |

---

### 4.6 Clarification UI (FE)

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Khi context thiếu → UI hiển thị form câu hỏi thay vì bắt đầu generate | 👁️ |
| 2 | Multiple-choice: hiển thị radio buttons / checkboxes | 👁️ |
| 3 | Open-ended: hiển thị textarea | 👁️ |
| 4 | Bấm "Gửi câu trả lời" → re-check context → nếu đủ → tiến hành generate | 👁️ Flow test |
| 5 | Nếu vẫn thiếu sau khi trả lời → hiển thị câu hỏi bổ sung (loop tối đa 3 vòng) | 👁️ |

---

### 4.7–4.9 RAG Assembly → Prompt Builder → Document Generator

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | `POST /api/generate/document` với đầy đủ params → trả về document content dạng structured JSON (theo template tree) | 🔌 |
| 2 | Mỗi section trong output có field `source_refs[]` trỏ về chunk IDs đã dùng | 🔌 Kiểm tra mỗi section |
| 3 | Document được lưu vào DB bảng `documents` + `doc_nodes` | 💾 Query sau khi generate |
| 4 | Traceability links được tự động tạo (output nodes → source nodes) | 💾 Query `traceability_links` |
| 5 | Streaming: Nội dung gửi qua SSE, FE hiển thị typing effect | 👁️ |

---

### 4.10–4.11 Evaluation Gate

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Sau khi generate xong, API tự động chạy evaluation → trả về `quality_report` | 🔌 Response chứa `quality_report` object |
| 2 | `coverage_score`: Mỗi source chunk được check "đã có trong output?" → tính % | 🔌 Score là số 0-100 |
| 3 | `completeness_score`: Mỗi template section được check "có nội dung?" → tính % | 🔌 Score là số 0-100 |
| 4 | `traceability_score`: Mỗi output section có `source_refs[]` non-empty? → tính % | 🔌 Score là số 0-100 |
| 5 | Nếu bất kỳ score < 70 (configurable) → response có `quality_gate_passed: false` | 🔌 Test với input thiếu |

---

### 4.12 Quality Gate UI

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | UI hiển thị Report Card với 3 thanh tiến trình (progress bar) + điểm số | 👁️ |
| 2 | Điểm ≥ ngưỡng: thanh màu xanh, nút "Xem & Review" được bật | 👁️ |
| 3 | Điểm < ngưỡng: thanh màu đỏ, nút "Re-generate" hoặc "Bổ sung context" hiển thị | 👁️ |
| 4 | Click vào điểm Coverage → mở danh sách chunks thiếu cụ thể | 👁️ |

---

### 4.13 Generated Doc Viewer

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Hiển thị tài liệu theo cấu trúc cây (expand/collapse sections) | 👁️ |
| 2 | Bên cạnh mỗi section: badge "Nguồn: BRD §2.1" (clickable → jump to source) | 👁️ |
| 3 | Mỗi section có Coverage score riêng (mini badge) | 👁️ |

---

## PHASE 5A — Review & Cascade Sync

### 5.1 Review UI

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Mỗi section có 3 nút: ✅ Approve, ✏️ Edit, ❌ Reject | 👁️ |
| 2 | Click Edit → section chuyển sang mode editable (contenteditable hoặc textarea) | 👁️ |
| 3 | Sau khi sửa → bấm Save → nội dung mới được lưu vào DB | 👁️ + 💾 |
| 4 | Approve toàn bộ sections → document status chuyển thành `approved` | 💾 |

---

### 5.2 Version Control

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Mỗi lần section được edit+save → `doc_nodes.version` tăng lên 1 | 💾 Query version trước/sau |
| 2 | API `GET /api/documents/{id}/history` trả về danh sách versions theo thời gian | 🔌 |
| 3 | Có thể xem nội dung bản cũ (read-only) | 🔌 `GET /api/documents/{id}/history/{version}` |

---

### 5.3 Impact Analysis

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Khi BRD node X tăng version → API `GET /api/impact/{node_id}` trả về list tất cả nodes bị ảnh hưởng (VD: SRS §3, Test Case TC-005) | 🔌 |
| 2 | Kết quả bao gồm: `affected_node_id`, `affected_doc_type`, `affected_doc_name`, `current_status` | 🔌 |
| 3 | Nodes bị ảnh hưởng có `stale=true` trong DB | 💾 |

---

### 5.4 Cascade Re-sync

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | `POST /api/cascade/resync/{node_id}` trigger AI re-generate nội dung cho node bị stale | 🔌 |
| 2 | Sau resync: node mới có `version+1`, `stale=false`, và `traceability_link` cập nhật | 💾 |
| 3 | Nội dung mới phản ánh thay đổi từ source (không phải bản copy y nguyên bản cũ) | 🧪 So sánh nội dung trước/sau, verify có sự khác biệt |

---

### 5.5 Flagging System

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Nodes stale hiển thị badge đỏ "⚠️ Lỗi thời" trên UI | 👁️ |
| 2 | Hover badge → tooltip hiển thị: "Lỗi thời vì BRD §2.1 vừa được sửa lúc 10:30" | 👁️ |
| 3 | API `GET /api/documents/{id}/stale-nodes` trả danh sách nodes cần review | 🔌 |

---

## PHASE 5B — AI Memory System

### 5.6 Diff Extractor

#### "Bài học" là gì? — Định nghĩa chính xác

Khi user review nội dung AI sinh ra, user có thể chỉnh sửa. Không phải mọi chỉnh sửa đều là "bài học". Hệ thống phải phân biệt được **tín hiệu (signal)** và **tiếng ồn (noise)**.

##### Phân loại Diff — 3 loại tín hiệu hợp lệ:

| Loại Diff | Định nghĩa | Ví dụ thực tế | Trích xuất thành Rule? |
|-----------|-----------|---------------|----------------------|
| **ADDITION** | User thêm nội dung mà AI KHÔNG sinh ra. Nghĩa là AI thiếu kiến thức/context về điều này | AI viết BRD phần "Bảo mật" nhưng không đề cập mã hóa. User thêm: *"Mọi dữ liệu nhạy cảm phải được mã hóa AES-256 khi lưu trữ"* | ✅ Có → Rule: "Khi viết phần Bảo mật, luôn bao gồm yêu cầu mã hóa dữ liệu lưu trữ" |
| **MODIFICATION** | User sửa lại nội dung AI đã viết — thay đổi cách diễn đạt, thuật ngữ, hoặc cấu trúc | AI viết: *"Users can login via SSO"*. User sửa thành: *"Khách hàng đăng nhập bằng hệ thống xác thực tập trung (SSO) của doanh nghiệp"* | ✅ Có → Rule: "Dùng 'khách hàng' thay vì 'users'. Viết bằng tiếng Việt. Giải thích viết tắt trong ngoặc" |
| **DELETION** | User xóa nội dung AI sinh ra vì sai, thừa, hoặc ngoài phạm vi | AI viết mục "Yêu cầu hiệu năng: Hệ thống xử lý 10,000 request/s". User xóa hoàn toàn vì dự án nhỏ không cần | ✅ Có → Rule: "Không tự đặt chỉ số hiệu năng định lượng nếu chưa được yêu cầu trong raw requirement" |

##### Bộ lọc tiếng ồn — 4 loại chỉnh sửa KHÔNG tạo rule:

| Loại Noise | Cách nhận diện | Ví dụ |
|-----------|---------------|-------|
| **Typo fix** | Diff ≤ 3 từ thay đổi, không thay đổi ý nghĩa | "nguời" → "người" |
| **Formatting** | Chỉ thay đổi markdown/bullet/heading level, nội dung y nguyên | `- item` → `1. item` |
| **Whitespace** | Chỉ thay đổi khoảng trắng, xuống dòng | Thêm dòng trống |
| **Reorder** | Di chuyển đoạn văn lên/xuống trong cùng section, không thay đổi nội dung | Hoán vị 2 bullet points |

##### Tiêu chí nghiệm thu:

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Khi user edit section (5.1) và save → system lưu `diff` vào bảng `review_diffs` | 💾 Record mới xuất hiện |
| 2 | Mỗi diff record gồm: `section_id`, `original_text`, `edited_text`, `diff_type` (ADDITION/MODIFICATION/DELETION), `word_count_delta`, `timestamp` | 💾 Kiểm tra đủ fields |
| 3 | Nếu user approve mà KHÔNG edit → không tạo diff | 💾 Approve không edit → 0 record mới |
| 4 | Diff ≤ 3 từ thay đổi → `diff_type = NOISE`, không chuyển sang Rule Summarizer | 💾 Tạo diff 1 từ → verify `diff_type = NOISE` |
| 5 | Diff chỉ thay đổi formatting (regex detect markdown-only changes) → `diff_type = NOISE` | 🧪 Đổi `- item` thành `* item` → verify filtered |
| 6 | `word_count_delta` được tính chính xác: `len(edited.split()) - len(original.split())` | 🧪 Tính tay so sánh |

---

### 5.7 Rule Summarizer

#### Chính xác 4 Category — Taxonomy cố định

Mỗi diff hợp lệ (không phải NOISE) được LLM phân tích và tạo thành **1 rule** thuộc chính xác 1 trong 4 category sau:

| Category | Định nghĩa chính xác | Ví dụ diff INPUT | Rule OUTPUT |
|---------|---------------------|-----------------|-------------|
| **STYLE** | Cách hành văn, giọng điệu, ngôi kể, độ dài câu. Không liên quan đến nội dung đúng/sai | AI viết chủ động: *"Hệ thống gửi email"*. User sửa bị động: *"Email được gửi bởi hệ thống"* | `"Sử dụng câu bị động khi mô tả hành vi hệ thống trong SRS"` |
| **TERMINOLOGY** | Thuật ngữ chuyên ngành, cách gọi tên, cách viết tắt. Phụ thuộc vào domain/công ty | AI viết: *"users"*. User sửa: *"khách hàng nội bộ"* | `"Dùng 'khách hàng nội bộ' thay vì 'users' hoặc 'người dùng' trong mọi tài liệu dự án này"` |
| **STRUCTURE** | Cấu trúc trình bày: thứ tự mục, heading, format bảng, cách đánh số. Không liên quan nội dung | AI viết yêu cầu dạng paragraph. User tách ra thành: *"Given-When-Then"* | `"Mọi yêu cầu chức năng phải viết theo format Given-When-Then với Acceptance Criteria rõ ràng"` |
| **DOMAIN_CONSTRAINT** | Quy tắc nghiệp vụ hoặc kỹ thuật cụ thể mà AI không biết vì nó nằm ngoài training data. Đây là loại quan trọng nhất | AI không đề cập mã hóa. User thêm: *"Dữ liệu PII phải mã hóa AES-256 at-rest và TLS 1.3 in-transit"* | `"Khi viết phần Security Requirements: bắt buộc bao gồm mã hóa AES-256 at-rest và TLS 1.3 in-transit cho dữ liệu PII"` |

#### Schema chính xác của 1 Rule (Pydantic)

```python
class MemoryRule(BaseModel):
    id: str                    # UUID auto-generated
    project_id: str            # Rule chỉ áp dụng cho dự án này
    category: Literal["STYLE", "TERMINOLOGY", "STRUCTURE", "DOMAIN_CONSTRAINT"]
    rule_text: str             # Câu imperative, bắt đầu bằng động từ (VD: "Dùng...", "Luôn...", "Không...")
    scope: str                 # Phạm vi áp dụng (VD: "security_section", "all_documents", "BRD_only")
    source_diff_id: str        # Trỏ về diff gốc đã sinh ra rule này
    confidence: float = 1.0    # Khởi tạo = 1.0, decay theo thời gian
    usage_count: int = 0       # Số lần rule được inject vào prompt
    is_active: bool = True
    is_pinned: bool = False    # User ghim vĩnh viễn
    created_at: datetime
    last_used: Optional[datetime] = None
```

#### LLM Extraction Prompt (mẫu)

Khi nhận được diff hợp lệ, Backend gửi prompt sau cho LLM:

```
Bạn là chuyên gia phân tích thay đổi tài liệu. Dưới đây là nội dung gốc (do AI sinh)
và nội dung đã sửa (do người dùng chỉnh). Hãy trích xuất QUY TẮC mà người dùng
muốn AI tuân theo trong tương lai.

## Nội dung gốc:
{original_text}

## Nội dung đã sửa:
{edited_text}

## Loại tài liệu: {doc_type} (VD: BRD, SRS, SAD)
## Section: {section_name}

Trả về JSON:
{
  "category": "STYLE | TERMINOLOGY | STRUCTURE | DOMAIN_CONSTRAINT",
  "rule_text": "<câu imperative rõ ràng, bắt đầu bằng động từ>",
  "scope": "<phạm vi áp dụng>",
  "reasoning": "<giải thích tại sao đây là 1 quy tắc chứ không phải sửa lỗi ngẫu nhiên>"
}

Quy tắc:
- rule_text PHẢI là câu mệnh lệnh (imperative), KHÔNG phải mô tả diff
- Nếu thay đổi quá cụ thể cho 1 trường hợp, không khái quát hóa được → trả {"skip": true}
- scope phải cụ thể: "all", "BRD_only", "SRS_only", "security_section", v.v.
```

#### Tiêu chí nghiệm thu:

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Mỗi diff hợp lệ (không NOISE) được gửi qua LLM → trả về JSON đúng schema `MemoryRule` | 🔌 API test |
| 2 | Category phải là 1 trong 4: `STYLE`, `TERMINOLOGY`, `STRUCTURE`, `DOMAIN_CONSTRAINT` | 🔌 Validation check |
| 3 | `rule_text` bắt đầu bằng động từ tiếng Việt (Dùng, Luôn, Không, Viết, Bao gồm...) — KHÔNG phải mô tả (VD: ❌ "User đã thêm mã hóa") | 🧪 Regex check: `^(Dùng|Luôn|Không|Viết|Bao gồm|Thay|Sử dụng|Đảm bảo|Tách|Xóa)` |
| 4 | `scope` không được rỗng và phải là 1 trong: `all`, `BRD_only`, `SRS_only`, `SAD_only`, `test_plan_only`, `{section_name}` | 🔌 |
| 5 | Nếu LLM trả `{"skip": true}` (diff quá cụ thể, không khái quát được) → không tạo rule | 🧪 Test với diff rất cụ thể (VD: sửa tên công ty) |
| 6 | Cùng 1 diff chạy 3 lần → category giống nhau (deterministic ở mức category) | 🧪 Repeat test, verify consistency |
| 7 | Test với ví dụ chuẩn (golden test): diff thêm "AES-256" → category = `DOMAIN_CONSTRAINT` | 🧪 Golden test case |
| 8 | Test với ví dụ chuẩn: diff đổi "user" → "khách hàng" → category = `TERMINOLOGY` | 🧪 Golden test case |
| 9 | Test với ví dụ chuẩn: diff đổi chủ động → bị động → category = `STYLE` | 🧪 Golden test case |
| 10 | Test với ví dụ chuẩn: diff thêm Given-When-Then format → category = `STRUCTURE` | 🧪 Golden test case |

---

### 5.8 Memory Schema & Storage

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | ChromaDB collection `ai_memory` tồn tại | 💾 `chroma_client.get_collection("ai_memory")` thành công |
| 2 | Mỗi entry có metadata: `project_id`, `category`, `confidence`, `usage_count`, `is_active`, `created_at`, `last_used` | 💾 `collection.get()` kiểm tra metadata fields |
| 3 | Embedding vector được tạo từ `rule_text` bằng embedding model | 💾 Embedding non-null |
| 4 | API `GET /api/memory/{project_id}` trả danh sách rules active | 🔌 |

---

### 5.9 Memory Retriever & Injector

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Tại bước Prompt Builder (4.8): nếu có rules active → block `[LEARNING RULES]` xuất hiện trong generated prompt | 🧪 Log prompt ra console, verify block tồn tại |
| 2 | Rules được sort by `confidence DESC`, lấy top-10 | 🧪 Tạo 15 rules, verify chỉ 10 cao nhất được inject |
| 3 | Chỉ rules có `is_active=true` được inject | 🧪 Deactivate 1 rule → verify không xuất hiện |
| 4 | Output AI sau khi có memory rules phải khác output không có rules (verify AI thực sự "đọc" rules) | 🧪 Compare 2 outputs: có rules vs không |

---

### 5.10 Confidence Decay

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Chạy decay job hàng ngày (cron hoặc startup check) | 🧪 Trigger manual, verify confidence giảm |
| 2 | Rule không dùng 30 ngày → `confidence < 0.2` → `is_active = false` | 🧪 Tạo rule, set `last_used = 30 ngày trước`, chạy decay, verify deactivated |
| 3 | Rule được sử dụng → `last_used` reset, `usage_count += 1`, `confidence` không decay | 🧪 |
| 4 | Công thức: `confidence = initial × 0.95^(days_since_last_used)` → verify bằng tính toán | 🧪 Tính tay vs giá trị DB |

---

### 5.11 Contradiction Detector

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Khi tạo rule mới → hệ thống tự search ChromaDB `similarity > 0.85` | 💾 |
| 2 | Nếu tìm thấy rule tương tự nhưng mâu thuẫn → trả `conflict: true` + `conflicting_rule_id` | 🔌 |
| 3 | Cả 2 rules bị flag `needs_resolution = true` | 💾 |
| 4 | API `GET /api/memory/{project_id}/conflicts` trả danh sách conflicts cần giải quyết | 🔌 |

---

### 5.12 Memory Curation Dashboard

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Trang hiển thị danh sách tất cả rules: `rule_text`, `category` badge, `confidence` bar, `usage_count` | 👁️ |
| 2 | Nút **Pin** → rule có `confidence = 1.0` vĩnh viễn (không decay) | 👁️ + 💾 |
| 3 | Nút **Delete** → `is_active = false`, rule biến mất khỏi list active | 👁️ + 💾 |
| 4 | Nút **Edit** → sửa `rule_text` inline, save → re-embed vector | 👁️ + 💾 |
| 5 | Hiển thị counter: "23/50 rules active" — Nếu vượt 50 → cảnh báo | 👁️ |
| 6 | Conflicts section: hiển thị cặp rules mâu thuẫn, user chọn giữ hoặc xóa | 👁️ |

---

## PHASE 6 — Frontend Nâng Cao

### 6.1 ChatView (RAG)

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Giao diện chat: input box + message history | 👁️ |
| 2 | Gửi "Yêu cầu nào liên quan thanh toán?" → AI trả câu trả lời + trích dẫn nguồn (chunk ID + text preview) | 👁️ |
| 3 | Nguồn trích dẫn clickable → jump đến document gốc | 👁️ |
| 4 | Streaming response (text hiện dần) | 👁️ |

---

### 6.2 Visual Traceability Map

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Sơ đồ graph hiển thị tất cả documents + connections (dùng thư viện như D3.js hoặc ReactFlow) | 👁️ |
| 2 | Nodes stale hiển thị màu đỏ | 👁️ |
| 3 | Click node → panel chi tiết hiện bên phải | 👁️ |
| 4 | Hover edge → tooltip hiển thị "SRS §3 ← BRD §2.1" | 👁️ |

---

### 6.3 Export PDF/Docx

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Nút "Xuất PDF" → tải file `.pdf` về | 🧪 File tải được, mở đọc được |
| 2 | PDF giữ nguyên heading structure, bảng biểu, font tiếng Việt | 👁️ |
| 3 | Footer có: "Generated by Anson Precision — {date}" | 👁️ |

---

### 6.4 Notification Center

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Icon bell trên TopBar hiển thị badge số (VD: 3 notifications chưa đọc) | 👁️ |
| 2 | Click → dropdown danh sách: "SRS §3 cần review", "BRD §2 vừa thay đổi" | 👁️ |
| 3 | Click notification → navigate đến document/section tương ứng | 👁️ |

---

### 6.5 UI/UX Polish

| # | Tiêu chí | Cách kiểm tra |
|---|---------|---------------|
| 1 | Dark mode: tất cả text đọc được, không có text trắng trên nền trắng | 👁️ Toggle dark mode, kiểm tra toàn bộ trang |
| 2 | Loading skeleton hiển thị khi đang fetch data (không blank screen) | 👁️ Simulate slow network |
| 3 | Animation mượt: page transition, modal open/close không giật | 👁️ |
| 4 | Responsive: Sidebar collapse khi width < 768px | 👁️ Resize browser |

---

## 📋 Tổng Kết

| Phase | Số tiêu chí DoD | Loại kiểm tra chính |
|-------|----------------|---------------------|
| Phase 1 | 24 tiêu chí | 🔌 API + 💾 DB |
| Phase 2 | 20 tiêu chí | 🔌 API + 👁️ UI |
| Phase 3 | 18 tiêu chí | 🔌 API + 💾 ChromaDB |
| Phase 4 | 34 tiêu chí | 🔌 API + 👁️ UI + 💾 DB |
| Phase 5A | 16 tiêu chí | 💾 DB + 👁️ UI |
| Phase 5B | 26 tiêu chí | 💾 ChromaDB + 🧪 Test |
| Phase 6 | 18 tiêu chí | 👁️ UI |
| **Tổng** | **~156 tiêu chí** | |

> [!IMPORTANT]
> Mỗi task chỉ được đánh dấu ✅ DONE khi **100% tiêu chí** trong bảng DoD tương ứng đều PASS.
> Nếu còn 1 tiêu chí FAIL → task ở trạng thái 🟡 IN PROGRESS, không được chuyển sang task tiếp theo (nếu có dependency).
