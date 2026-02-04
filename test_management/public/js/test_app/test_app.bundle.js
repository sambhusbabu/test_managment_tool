import { createApp } from "vue";
import Home from "./Home.vue";
// Import the generated Tailwind CSS for this component bundle
import "./tailwind.css"

class TestApp {
    constructor({ wrapper, props } = {}) {
        if (!wrapper) {
            this.make_dialog();
        } else {
            this.wrapper = wrapper.get ? wrapper.get(0) : wrapper;
        }

        const app = createApp(Home, props || {});
        // make sure project-level globals are set (same pattern as other bundles)
        try {
            SetVueGlobals(app);
        } catch (e) {
            // SetVueGlobals may be available at runtime in Frappe; ignore if not present now
            console.warn('SetVueGlobals not available', e);
        }

        this.vm = app.mount(this.wrapper || this.dialog?.body || document.createElement('div'));

        if (!this.dialog) {
            this.vm.wrapper_ready = true;
        }
    }

    make_dialog(title) {
        const dialog_opts = {
            title: title || __('Test App'),
            primary_action_label: __('Close'),
            primary_action: () => this.dialog.hide(),
            on_page_show: () => {
                this.vm.wrapper_ready = true;
            },
        };

        this.dialog = new frappe.ui.Dialog(dialog_opts);
        this.wrapper = this.dialog.body;
        this.dialog.show();
        this.dialog.$wrapper.on('hidden.bs.modal', function () {
            $(this).data('bs.modal', null);
            $(this).remove();
        });
    }
}

frappe.provide('frappe.ui');
frappe.ui.TestApp = TestApp;
export default TestApp;
