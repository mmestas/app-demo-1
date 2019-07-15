
(function () {
    "use strict";
    var lastPayDetail="";
    var isReady = jQuery(".abOnlinePaymentFields").length;
    if (isReady) {
        setupForm();
    } else {
        jQuery( document ).ready(function(){
            setupForm();
        })
    }
    function setupForm () {
        jQuery("body").on("change",".abPayButton input",function () {
            if (jQuery(lastPayDetail).length) lastPayDetail.hide();
            showPayDetail(jQuery("input[name=onDemandMethodTypeId]:checked").val());
        });
        var onDemandMethodTypeIdInit = parseInt(jQuery("input[name=onDemandMethodTypeIdInit]").val());
        if (!isNaN(onDemandMethodTypeIdInit)) {
            showPayDetail (onDemandMethodTypeIdInit);
        } else {
            if (jQuery("#abPayButtonCardOnline").length) {
                jQuery("#abPayButtonCardOnline input").prop("checked", true);
                showPayDetail (1);
            } else if (jQuery("#abPayDetailCardAccount").length) {
                jQuery("#abPayDetailCardAccount input").prop("checked", true);
                showPayDetail (2);
            } else if (jQuery("#abPayDetailECheckOnline").length) {
                jQuery("#abPayDetailECheckOnline input").prop("checked", true);
                showPayDetail (3);
            } else if (jQuery("#abPayDetailECheckAccount").length) {
                jQuery("#abPayDetailECheckAccount input").prop("checked", true);
                showPayDetail (4);
            } else if (jQuery("#abPayDetailBill").length) {
                jQuery("#abPayDetailBill input").prop("checked", true);
                showPayDetail (5);
            } else if (jQuery("#abPayDetailPayPal").length) {
                jQuery("#abPayDetailPayPal input").prop("checked", true);
                showPayDetail (6);
            }
        }
	}
    function showPayDetail (payDetailId) {
        jQuery(".abPayButton input[value="+payDetailId+"]").prop("checked",true);
        switch (parseInt(payDetailId)) {
        case 1:
            lastPayDetail = jQuery(".abPayDetailCardOnline");
            break;
        case 2:
            lastPayDetail = jQuery(".abPayDetailECheckOnline");
            break;
        case 3:
            lastPayDetail = jQuery(".abPayDetailBill");
            break;
        case 4:
            lastPayDetail = jQuery(".abPayDetailCardAccount");
            break;
        case 5:
            lastPayDetail = jQuery(".abPayDetailECheckAccount");
            break;
        case 6:
            lastPayDetail = jQuery(".abPayDetailPayPal");
            break;
        }
        if (jQuery(lastPayDetail).length) lastPayDetail.show();
		jQuery('#abPayButtonPayPalSubmit').click(function(event){
			event.preventDefault();
			var newForm = jQuery('&lt;form&gt;', {'action': jQuery("input[name=payPalAction]").val(),'target': '_top'}
			).append(jQuery('&lt;input&gt;', { 'name': 'cmd', 'value': jQuery("input[name=cmd]").val(), 'type': 'hidden'})
			).append(jQuery('&lt;input&gt;', { 'name': 'business', 'value': jQuery("input[name=business]").val(), 'type': 'hidden'})
			).append(jQuery('&lt;input&gt;', { 'name': 'item_name', 'value': jQuery("input[name=item_name]").val(), 'type': 'hidden'})
			).append(jQuery('&lt;input&gt;', { 'name': 'currency_code', 'value': jQuery("input[name=currency_code]").val(), 'type': 'hidden'})
			).append(jQuery('&lt;input&gt;', { 'name': 'amount', 'value': jQuery("input[name=amount]").val(), 'type': 'hidden'})
			).append(jQuery('&lt;input&gt;', { 'name': 'return', 'value': jQuery("input[name=return]").val(), 'type': 'hidden'})
			).append(jQuery('&lt;input&gt;', { 'name': 'notify_url', 'value': jQuery("input[name=notify_url]").val(), 'type': 'hidden'})
			).append(jQuery('&lt;input&gt;', { 'name': 'shopping_url', 'value': jQuery("input[name=shopping_url]").val(), 'type': 'hidden'})
			);
			newForm.appendTo("body").submit();
		});
	}
})();
