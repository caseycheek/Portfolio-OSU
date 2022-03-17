function deleteTurn(charID, enID){   
    $.ajax({
        url: '/turnorder/' + charID + "&" + enID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};