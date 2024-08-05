$(document).ready(function () {
    // Handle click on "Show More" button
    $("#show-more-btn").click(function (e) {
        e.preventDefault();
        // Toggle the visibility of the additional content
        $("#inner-navigation-content").slideToggle();
    });

    $("#show-more-btn-2").click(function (e) {
        e.preventDefault();
        // Toggle the visibility of the additional content
        $("#inner-navigation-content-2").slideToggle();
    });

    // Handle click on "See Also" button
    $("#see-also-btn").click(function (e) {
        e.preventDefault();
        // Check if the additional content is visible
        if ($("#inner-navigation-content").is(":visible")) {
            // Toggle the visibility of the "See Also" content
            $("#outer-navigation-content").slideToggle();
        } else {
            // If the additional content is not visible, you can choose to handle it differently or show a message
            alert("Please click 'Show More' first.");
        }
    });
});

$(document).on('click', function (e) {
    // Collapse the navbar if the clicked element is not part of the navbar
    if (!$(e.target).closest('.navbar').length) {
        $('.navbar-collapse').collapse('hide');
    }
});

$('.navbar-toggler').on('click', function () {
    // Toggle the collapse state when the toggler button is clicked
    $('.navbar-collapse').collapse('toggle');
});