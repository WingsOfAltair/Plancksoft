$(function () {
    $(
        "#contactForm input,#contactForm textarea,#contactForm button"
    ).jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function ($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var phone = $("input#phone").val();
            var message = $("textarea#message").val();
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(" ") >= 0) {
                firstName = name.split(" ").slice(0, -1).join(" ");
            }
            $this = $("#sendMessageButton");
            $this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages
            $.ajax({
                url: "https://plancksoftpos.online/Content/assets/mail/contact_me.php",
                type: "POST",
                data: {
                    name: name,
                    phone: phone,
                    email: email,
                    message: message,
                },
                dataType: "json", // ← important
                cache: false,
                success: function (response) {
                    if (response.status === "success") {
                        $("#success").html("<div class='alert alert-success'>");
                        $("#success > .alert-success")
                            .html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>")
                            .append("<strong>Your message has been sent. </strong>");
                        $("#contactForm").trigger("reset");
                    } else {
                        $("#success").html("<div class='alert alert-danger'>");
                        $("#success > .alert-danger")
                            .html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>")
                            .append($("<strong>").text(
                                "Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!"
                            ));
                        $("#contactForm").trigger("reset");
                    }
                },
                error: function () {
                    $("#success").html("<div class='alert alert-danger'>");
                    $("#success > .alert-danger")
                        .html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>")
                        .append($("<strong>").text(
                            "Sorry " + firstName + ", a network error occurred. Please try again later!"
                        ));
                    $("#contactForm").trigger("reset");
                },
                complete: function () {
                    setTimeout(function () {
                        $this.prop("disabled", false);
                    }, 1000);
                }
            });
        },
        filter: function () {
            return $(this).is(":visible");
        },
    });

    $('a[data-toggle="tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

/*When clicking on Full hide fail/success boxes */
$("#name").focus(function () {
    $("#success").html("");
});
