<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
error_reporting(E_ALL);
ini_set('display_errors', 1);

require '../PHPMailer/src/Exception.php';
require '../PHPMailer/src/PHPMailer.php';
require '../PHPMailer/src/SMTP.php';

// Adresse email du destinataire
$siteOwnersEmail = 'tristan.raoult62@gmail.com';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupération des données du formulaire
    $name = htmlspecialchars(trim($_POST['contactName']));
    $email = htmlspecialchars(trim($_POST['contactEmail']));
    $subject = htmlspecialchars(trim($_POST['contactSubject']));
    $contact_message = htmlspecialchars(trim($_POST['contactMessage']));

    // Validation des champs
    $error = [];
    if (strlen($name) < 2) {
        $error['name'] = "Veuillez entrer un nom valide (minimum 2 caractères).";
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error['email'] = "Veuillez entrer une adresse email valide.";
    }
    if (strlen($contact_message) < 15) {
        $error['message'] = "Votre message doit contenir au moins 15 caractères.";
    }
    if (empty($subject)) {
        $subject = "Formulaire de contact";
    }

    // Si aucune erreur
    if (empty($error)) {
        $mail = new PHPMailer(true);
        try {
            // Configuration SMTP
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'tristan.raoult62@gmail.com'; // Votre email Gmail
            $mail->Password = 'zxgc abho ufsn iqyn'; // Mot de passe d'application Gmail
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            // Destinataires
            $mail->setFrom($email, $name);
            $mail->addAddress($siteOwnersEmail);

            // Contenu de l'email
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = "
                <strong>Nom :</strong> {$name}<br>
                <strong>Email :</strong> {$email}<br>
                <strong>Message :</strong><br>{$contact_message}
            ";
            $mail->AltBody = "Nom : {$name}\nEmail : {$email}\nMessage :\n{$contact_message}";

            // Envoi
            $mail->send();
            echo json_encode(['success' => true, 'message' => 'Votre message a bien été envoyé !']);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => "Erreur lors de l'envoi : {$mail->ErrorInfo}"]);
        }
    } else {
        echo json_encode(['success' => false, 'errors' => $error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
}
error_reporting(E_ALL);
ini_set('display_errors', 1);

?>
