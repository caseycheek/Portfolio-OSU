function deleteCondition(id){   
    $.ajax({
        url: '/conditions/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};