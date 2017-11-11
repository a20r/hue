$(document).ready(function()
{
    $("#light-checkbox").change(function()
    {
        $.ajax({
            url: "/state",
            type: "POST",
            data: JSON.stringify({
                light: 3,
                state: this.checked
            }),
            contentType:"application/json; charset=utf-8",
            dataType: "json"
        });
    });
});
