// Loader for test_app bundle — require the logical asset path so Frappe
// resolves the hashed filename from the manifest at runtime.
if (frappe.require) {
    frappe.require("test_app.bundle.js");
} else {
    frappe.ready(function () {
        frappe.require("test_app.bundle.js");
    });
}
