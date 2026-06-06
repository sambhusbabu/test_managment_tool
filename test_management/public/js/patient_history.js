frappe.pages['patient_history'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Patient History',
        single_column: true
    });
    var mountId = 'patient-history-vue';

    // render into the page main so the Frappe page header / actions remain visible
    page.main.html('<div style="padding:20px"><div id="' + mountId + '"></div></div>');

    function mountHome() {
        if (frappe.ui && frappe.ui.TestApp) {
            new frappe.ui.TestApp({ wrapper: $('#' + mountId) });
        } else {
            console.warn('TestApp not available to mount Home.vue');
        }
    }

    // load bundle but don't auto-mount
    var loadBundle = function(cb) {
        if (frappe.require) {
            frappe.require('test_patient_history.bundle.js', cb);
        } else {
            frappe.ready(function () { frappe.require('test_patient_history.bundle.js', cb); });
        }
    };

    loadBundle(function() {
        // add primary action to page header
        if (page && page.set_primary_action) {
            page.set_primary_action('Open Dental Chart', function() { console.log('Primary action clicked');  });
        }
        // auto-mount so page shows the Vue app immediately
        mountHome();
    });
};