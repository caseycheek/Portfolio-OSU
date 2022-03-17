function updateEncounter(id) {
    $("form[name='update-encounters']").validate({
        // Specify validation rules
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            round: "required",
        },
        // Specify validation error messages
        messages: {
            round: "Please Enter a Round Number",
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            $.ajax({
                url: '/encounters/' + id,
                type: 'PUT',
                data: $('#update-encounter').serialize(),
                success: function(result){
                    window.location.replace("./");
                }
            })
        }
    })
};