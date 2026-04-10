# students.json 课表格式

> 来源：Teaching-Dashboard（Student-Profiles 仓库）

## 规则

课表数据集中存在 `students.json`，前端和智能体都读这个文件。

## 格式

```json
{
  "updated": "2026-04-04",
  "sessions": [
    {
      "id": "S01",
      "day": "周二",
      "time": "下午",
      "type": "一对二",
      "grade": "九年级",
      "subjects": ["语文"],
      "students": ["张翰中", "曾梓瑞"]
    }
  ],
  "students": [
    {
      "name": "龙其乐",
      "grade": "九年级",
      "sessions": ["S09"],
      "profile": "profiles/龙其乐.md"
    }
  ]
}
```

## 注意

- 不要加 `current_week` 和 `semester` 字段（曾经加过，值过时且从未被使用）
- 前端用 `profilesData.sessions` 读取课表
- `day` 字段的"周X"格式，前端用 `dayMap = {'日':0,'一':1,...,'六':6}` 转数字
