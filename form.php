<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Process the form submission and send the email

    // Get the form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Set the recipient email address
    $to = 'georgiopapairo@gmail.com';

    // Set the email subject
    $subject = 'New message from your website';

    // Build the email content
    $body = "Name: $name\n";
    $body .= "Email: $email\n\n";
    $body .= "Message:\n$message";

    // Send the email
    $success = mail($to, $subject, $body);

    // Redirect the user to a thank-you page
    if ($success) {
        header('Location: thanks.html');
        exit;
    } else {
        header('Location: error.html');
        exit;
    }
}
?>