function updateItem(id) {
    $("form[name='update-item']").validate({
        // Specify validation rules
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            name: "required",
            quantity: "required"
        },
        // Specify validation error messages
        messages: {
            name: "Please enter a name",
            quantity: "Please enter a number"
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            console.log("in the submit");
            $.ajax({
                url: '/items/' + id,
                type: 'PUT',
                data: $('#update-item').serialize(),
                success: function(result){
                    window.location.replace("./");
                }
            })
        }
    })
};
