<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get JSON data since Vercel typically sends JSON
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        // Fall back to POST data if JSON is not received
        $data = $_POST;
    }

    // Get the form fields and sanitize
    $name = strip_tags(trim($data["name"] ?? ''));
    $name = str_replace(array("\r","\n"),array(" "," "),$name);
    $email = filter_var(trim($data["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $message = trim($data["message"] ?? '');

    // Validate the data
    if (empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["error" => "Please complete all fields correctly."]);
        exit;
    }

    // Set the recipient email address
    $recipient = "istiaquezaman51@gmail.com";
    $subject = "New Contact Form Message from Sahara Shine";

    // Build the email content
    $email_content = "You have received a new message from your website contact form.\n\n";
    $email_content .= "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // Build the email headers
    $email_headers = "From: Sahara Shine Contact Form <noreply@saharashine.com>\r\n";
    $email_headers .= "Reply-To: $name <$email>\r\n";
    $email_headers .= "X-Mailer: PHP/" . phpversion();
    $email_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Send the email
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo json_encode(["message" => "Thank you! Your message has been sent."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Oops! Something went wrong. Please try again later."]);
    }

} else {
    http_response_code(403);
    echo json_encode(["error" => "Method not allowed"]);
}
?>

