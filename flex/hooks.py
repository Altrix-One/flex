app_name = "flex"
app_title = "Flex"
app_publisher = "Cohenix"
app_description = "Gym Management Module"
app_email = "christiaan.swart@epiuse.com"
app_license = "mit"

# Frontend Integration
app_include_js = [
    "/assets/flex/js/flex.bundle.js"
]
app_include_css = [
    "/assets/flex/css/flex.bundle.css"
]

# Web Include JS/CSS
web_include_js = [
    "/assets/flex/js/flex.bundle.js"
]
web_include_css = [
    "/assets/flex/css/flex.bundle.css"
]

# Website Routes
website_route_rules = [
    {"from_route": "/app/<path:app_path>", "to_route": "app"},
    {"from_route": "/login", "to_route": "login"}
]

# DocType Permissions
permission_query_conditions = {
    "Gym Member": "flex.permissions.get_gym_member_permission_query",
    "Gym Trainer": "flex.permissions.get_gym_trainer_permission_query",
    "Gym Class": "flex.permissions.get_gym_class_permission_query"
}

has_permission = {
    "Gym Member": "flex.permissions.has_gym_member_permission",
    "Gym Trainer": "flex.permissions.has_gym_trainer_permission",
    "Gym Class": "flex.permissions.has_gym_class_permission"
}

# Desk Sidebar Config
get_desk_sidebar_items = "flex.config.desktop.get_desk_sidebar_items"

# API Endpoints
api_key_whitelist = [
    "flex.api.*"
]

# CORS Configuration
allow_cors = ["*"]

# Document Events
doc_events = {
    "Gym Member": {
        "after_insert": "flex.events.member.after_insert",
        "on_update": "flex.events.member.on_update",
        "on_trash": "flex.events.member.on_trash"
    },
    "Gym Class": {
        "after_insert": "flex.events.class.after_insert",
        "on_update": "flex.events.class.on_update",
        "on_trash": "flex.events.class.on_trash"
    }
}

# Jinja Config
jinja = {
    "methods": [
        "flex.utils.get_sidebar_items",
        "flex.utils.get_user_info"
    ]
}

# Fixtures
fixtures = [
    {
        "doctype": "Custom Field",
        "filters": [
            ["module", "=", "flex"]
        ]
    },
    {
        "doctype": "Property Setter",
        "filters": [
            ["module", "=", "flex"]
        ]
    },
    {
        "doctype": "Role",
        "filters": [
            ["name", "in", ("Gym Admin", "Gym Member", "Gym Trainer")]
        ]
    }
]