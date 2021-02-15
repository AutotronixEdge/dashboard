<?php
    // $ch = curl_init();

    // curl_setopt($ch, CURLOPT_URL, 'https://rest.textmagic.com/api/v2/replies');
    // curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    // curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');

    // curl_setopt($ch, CURLOPT_USERPWD, 'dannyharris2' . ':' . 'oi6ZeQBvC95NuD1XvR8GJKzxtFZP6n');

    // $result = curl_exec($ch);
    // if (curl_errno($ch)) {
    //     echo 'Error:' . curl_error($ch);
    // }
    // curl_close($ch);

    $username = "dannyharris2";
    $password = "oi6ZeQBvC95NuD1XvR8GJKzxtFZP6n";
    $remote_url = 'https://rest.textmagic.com/api/v2/replies';

    // Create a stream
    $opts = array(
    'http'=>array(
        'method'=>"GET",
        'header' => "Authorization: Basic " . base64_encode("$username:$password")                 
    )
    );

    $context = stream_context_create($opts);

    // Open the file using the HTTP headers set above
    $file = file_get_contents($remote_url, false, $context);

    print($file);
?>