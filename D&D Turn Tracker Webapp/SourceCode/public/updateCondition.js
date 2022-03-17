function updateCondition(id) {
    $("form[name='update-condition']").validate({
        // Specify validation rules
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            name: "required",
        },
        // Specify validation error messages
        messages: {
            name: "Please enter your a condition name",
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            $.ajax({
                url: '/conditions/' + id,
                type: 'PUT',
                data: $('#update-condition').serialize(),
                success: function (result) {
                    window.location.replace("./");
                }
            })
        }
    });
};