// Copyright (c) 2026, SSB and contributors
// For license information, please see license.txt

frappe.ui.form.on("Test Management Tools", {
	refresh(frm) {
		// Mount the Vue Home component into the HTML field named `html`.
		// We use frappe.require with the logical asset key so Frappe maps
		// to the hashed bundle filename from assets.json at runtime.

		// get the field wrapper
		const field = frm.get_field('html');
		if (!field) return;

		// ensure unique mount node per doc
		const mount_id = `test-app-mount-${frm.docname || frm.doc?.name || Math.random().toString(36).slice(2)}`;

		// clear previous content and add mount node
		field.$wrapper.empty();
		const mount_el = document.createElement('div');
		mount_el.id = mount_id;
		field.$wrapper.append(mount_el);

		// require the bundle by logical key; Frappe will resolve the actual file
		frappe.require('test_app.bundle.js', function() {
			try {
				// Create the TestApp and mount into the created element
				// Accept either a DOM element or jQuery wrapper as `wrapper`.
				new frappe.ui.TestApp({ wrapper: document.getElementById(mount_id) });
			} catch (e) {
				console.error('Failed to mount TestApp:', e);
				frappe.show_alert({ message: __('Failed to load widget'), indicator: 'red' });
			}
		});
	},
});
