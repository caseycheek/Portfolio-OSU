function deleteItem(id){   
    $.ajax({
        url: '/items/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
