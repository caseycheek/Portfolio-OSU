function deleteConChar(conID, charID){   
    $.ajax({
        url: '/characterdetails/' + conID + "&" + charID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};