function updateCharacter(id) {
    $("form[name='update-character']").validate({
        // Specify validation rules
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            name: "required",
            initiativeBonus: "required"
        },
        // Specify validation error messages
        messages: {
            name: "Please enter a name",
            initiativeBonus: "Please enter a number"
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            $.ajax({
                url: '/characters/' + id,
                type: 'PUT',
                data: $('#update-character').serialize(),
                success: function (result) {
                    window.location.replace("./");
                }
            })
        }
    })
};
