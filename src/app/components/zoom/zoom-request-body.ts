export interface ZoomRequest {
    "topic": "string",
    "type": "integer",
    "start_time": "string [date-time]",
    "duration": "integer",
    "schedule_for": "string",
    "timezone": "string",
    "password": "string",
    "agenda": "string",
    "recurrence": {
        "type": "integer",
        "repeat_interval": "integer",
        "weekly_days": "string",
        "monthly_day": "integer",
        "monthly_week": "integer",
        "monthly_week_day": "integer",
        "end_times": "integer",
        "end_date_time": "string [date-time]"
    },
    "settings": {
        "host_video": "boolean",
        "participant_video": "boolean",
        "cn_meeting": "boolean",
        "in_meeting": "boolean",
        "join_before_host": "boolean",
        "mute_upon_entry": "boolean",
        "watermark": "boolean",
        "use_pmi": "boolean",
        "approval_type": "integer",
        "registration_type": "integer",
        "audio": "string",
        "auto_recording": "string",
        "enforce_login": "boolean",
        "enforce_login_domains": "string",
        "alternative_hosts": "string",
        "global_dial_in_countries": [
            "string"
        ],
        "registrants_email_notification": "boolean"
    }
}