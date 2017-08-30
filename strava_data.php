<?php

function stripUnnecessaryAthleteResponseData($data)
{
    $filteredData = array_filter($data, function ($key) {
        $athleteProps = array("firstname", "lastname", "email", "bikes", "shoes");

        return in_array($key, $athleteProps);
    }, ARRAY_FILTER_USE_KEY);

    return $filteredData;
}

function stripUnnecessaryActivitiesResponseData($data)
{
    $filteredActivities = [];
    foreach ($data as $activity) {
        $filteredActivity = array_filter($activity, function ($key) {
            $activityProps = array("distance", "moving_time", "type", "start_date");

            return in_array($key, $activityProps);
        }, ARRAY_FILTER_USE_KEY);

        $filteredActivities[] = $filteredActivity;
    }

    return $filteredActivities;
}

function getActivities($ch)
{
    $parameters = '?';
    $parameters .= 'per_page=50';
    $parameters .= '&after=1451606400'; //Fetch activities after 2016-01-01

    curl_setopt($ch, CURLOPT_URL, 'https://www.strava.com/api/v3/athlete/activities' . $parameters);
    $response = curl_exec($ch);
    $jsonResponse = json_decode($response, true);
    return stripUnnecessaryActivitiesResponseData($jsonResponse);
}

function getAthlete($ch)
{
    curl_setopt($ch, CURLOPT_URL, 'https://www.strava.com/api/v3/athlete');
    $response = curl_exec($ch);

    $jsonResponse = json_decode($response, true);
    $hasError = array_key_exists('errors', $jsonResponse);

    if($hasError){
        return $jsonResponse;
    }

    return stripUnnecessaryAthleteResponseData($jsonResponse);
}

function getAllData()
{
    $ACCESS_TOKEN = '';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer ' . $ACCESS_TOKEN));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = array();
    $response['athlete'] = getAthlete($ch);

    if(array_key_exists('errors', $response['athlete'])){
        $errorResponse = array();
        $errorResponse['errors'] = array();
        $errorResponse['errors'][0]['message'] = $response['athlete']['message'];
        $errorResponse['errors'][0]['errors'] = $response['athlete']['errors'];

        return json_encode($errorResponse);
    }

    $response['activities'] = getActivities($ch);

    curl_close($ch);

    return json_encode($response);
}

echo getAllData();

?>
