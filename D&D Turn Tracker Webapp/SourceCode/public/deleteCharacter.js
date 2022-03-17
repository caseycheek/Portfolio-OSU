function deleteCharacter(id){   
    $.ajax({
        url: '/characters/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};