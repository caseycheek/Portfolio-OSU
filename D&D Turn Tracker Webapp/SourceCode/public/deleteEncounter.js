function deleteEncounter(id){   
    $.ajax({
        url: '/encounters/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};