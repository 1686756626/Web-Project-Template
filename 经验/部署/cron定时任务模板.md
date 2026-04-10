# cron 定时任务模板

> 来源：CXL（高考冲刺教学系统，14 个 cron 任务验证通过）

## 规则

定时任务用 `copaw cron` 管理。每个任务对应一个时间段。

## 模板

```bash
# 创建
copaw cron create \
  --agent-id YOUR_AGENT_ID \
  --type agent \
  --name "任务名称" \
  --cron "30 8 * * 1-6" \
  --channel dingtalk \
  --target-user TARGET_USER \
  --target-session TARGET_SESSION \
  --timezone Asia/Shanghai \
  --text "任务描述，发给智能体的指令"

# 查看
copaw cron list --agent-id YOUR_AGENT_ID

# 暂停/恢复
copaw cron pause   --agent-id YOUR_AGENT_ID --name "任务名称"
copaw cron resume  --agent-id YOUR_AGENT_ID --name "任务名称"

# 删除
copaw cron delete  --agent-id YOUR_AGENT_ID --name "任务名称"

# 手动触发
copaw cron run     --agent-id YOUR_AGENT_ID --name "任务名称"
```

## cron 表达式速查

```
┌──────── 分钟 (0-59)
│ ┌────── 小时 (0-23)
│ │ ┌──── 日 (1-31)
│ │ │ ┌── 月 (1-12)
│ │ │ │ ┌ 星期 (0-7, 0和7都是周日)
│ │ │ │ │
* * * * *
```

| 需求 | 表达式 | 说明 |
|------|--------|------|
| 每天早8:30 | `30 8 * * *` | |
| 工作日早8:30 | `30 8 * * 1-5` | 周一到周五 |
| 排除周日 | `30 8 * * 1-6` | 周一到周六 |
| 每2小时 | `0 */2 * * *` | |
| 多个时间点 | `0 8,12,18 * * *` | 8点、12点、18点 |

## 前置条件

1. **先建立会话** — 在钉钉和目标用户对话一次
2. **获取 user_id 和 session_id**：
   ```bash
   copaw chats list --agent-id YOUR_AGENT_ID --channel dingtalk
   ```
3. **替换模板中的 TARGET_USER 和 TARGET_SESSION**

## 注意

- `--timezone` 必须显式指定，否则可能用 UTC
- 改 cron 时间时，必须同步改日历文件，否则信息矛盾
- 任务名不要用特殊字符，用中文即可
