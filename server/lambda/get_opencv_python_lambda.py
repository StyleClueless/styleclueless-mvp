import json
import logging
import boto3
import botocore
import os


def lambda_handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    logger.info('event parameter: {}'.format(event))
    # s3_path=event['pathParameters']['s3_path']
    # jtopy=json.dumps(event['body']) #json.dumps take a dictionary as input and returns a string as output.
    # payload=json.loads(jtopy)
    # logger.info('payload parsed parameter: {}'.format(payload))

    s3_path=event["queryStringParameters"]['s3_path']

    # s3_path=event['body']['s3_path']
    # s3_path=payload['s3_path']

    tmp_filename = '/tmp/my_image.jpg'
    tmp_transparent_filename = '/tmp/transparent.png'
    # gray_filename = 'my_image-gray.jpg'

    s3 = boto3.resource('s3')
    BUCKET_NAME = os.environ.get("BUCKET_NAME")
    # S3_KEY = os.environ.get("S3_KEY")
    S3_KEY=s3_path;
    import numpy as np
    import cv2

    try:
        s3.Bucket(BUCKET_NAME).download_file(S3_KEY, tmp_filename)
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "404":
            print("The object does not exist: s3://" + BUCKET_NAME + S3_KEY)
        else:
            raise
    img = cv2.imread(tmp_filename)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    v = hsv[:, :, 2]
    th, threshed = cv2.threshold(v, 100, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)
    threshed[-1] = 255

    cnts = cv2.findContours(threshed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)[-2]

    mask = np.zeros_like(threshed)
    cv2.drawContours(mask, cnts, -1, (255, 255, 255), -1, cv2.LINE_AA)
    mask = cv2.erode(mask, np.ones((3, 3), np.int32), iterations=1)

    png = np.dstack((img, mask))
    cv2.imwrite(tmp_transparent_filename, png)

    # image = cv2.imread(tmp_filename)
    # image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # cv2.imwrite(tmp_filename, image_gray)

    s3 = boto3.client('s3')
    NEW_S3_KEY=S3_KEY.replace('.jpg','.png');
    NEW_S3_KEY=NEW_S3_KEY.replace('.jpeg','.png');
    s3.upload_file(tmp_transparent_filename, BUCKET_NAME, NEW_S3_KEY)

    return {
        "statusCode": 200,
          "isBase64Encoded":"false",
          "headers": { "content-type": "application/json"},
        "body": json.dumps({
            "s3_path":NEW_S3_KEY,
            "just":"just",
            "message": "image saved to s3://" + BUCKET_NAME + "/" + NEW_S3_KEY,
        }),
    }


