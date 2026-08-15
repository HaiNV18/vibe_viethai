# Data Flow & CRUD

## 1. DatabaseManager

`DatabaseManager` chịu trách nhiệm:

- Load database.
- Open database.
- Execute SQL.
- Query rows.
- Save database.
- Import database.
- Export database.

API đề xuất:

```js
DatabaseManager.init()
DatabaseManager.query(sql, params)
DatabaseManager.execute(sql, params)
DatabaseManager.save()
DatabaseManager.export()
DatabaseManager.import(file)
```

## 2. VideoRepository

API:

```js
getAll(options)
getById(id)
create(video)
update(id, video)
delete(id)
search(keyword)
getTopByViews(limit)
getViewStats(range)
```

## 3. VideoService

Service chịu trách nhiệm:

- Validation.
- Business rules.
- Gọi repository.
- Format dữ liệu cho UI khi cần.

Không để page tự viết SQL.

## 4. DashboardService

API:

```js
getSummary()
getTopVideos(limit = 10)
getViewsByDay()
getViewsByMonth()
```

`getSummary()` trả:

```js
{
  totalVideos,
  totalViews,
  totalStorageBytes
}
```

## 5. Delete video

Có hai chiến lược.

### Hard delete

```sql
DELETE FROM videos
WHERE id = ?;
```

### Soft delete

```sql
UPDATE videos
SET status = 'deleted',
    updated_at = ?
WHERE id = ?;
```

Khuyến nghị soft delete nếu cần audit/recovery.

## 6. Save strategy

Mọi mutation:

```text
INSERT / UPDATE / DELETE
       |
       v
SQLite WASM memory
       |
       v
DatabaseManager.save()
       |
       v
IndexedDB / OPFS
```

Không giả định rằng thay đổi SQLite memory tự động tồn tại sau refresh.

## 7. Import / Export

Nên có utility:

```text
Export users.db
Export videos.db
Import users.db
Import videos.db
```

Mục đích:

- Backup.
- Demo data.
- Migration.
- Debug.

## 8. Thumbnail

Nếu chỉ lưu URL:

```text
thumbnail_url
```

Không lưu ảnh binary lớn trong SQLite trừ khi có lý do rõ ràng.

Nếu upload local file, có thể lưu file vào browser storage và lưu reference trong SQLite.
