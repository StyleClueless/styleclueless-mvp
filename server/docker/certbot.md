sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python-certbot-nginx


sudo apt-get update && sudo apt-get -y upgrade
sudo apt-get install python-pip


pip install certbot_dns_route53==0.22.2



IAM AWS : 
create user 
save acess + secret key upon creating!

then add this policy to it 

{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "route53:ListHostedZones",
                "route53:GetChange"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Effect" : "Allow",
            "Action" : [
                "route53:ChangeResourceRecordSets"
            ],
            "Resource" : [
                "arn:aws:route53:::hostedzone/{YOURHOSTEDZONEID}"
            ]
        }
    ]
}


In the home folder create an .aws
 folder and inside that create a text file with the name 
 credentials with the following contents.
 
 if you run as root should be => /root/.aws/
[default]
aws_access_key_id=XXXXXX
aws_secret_access_key=XXXX/XXXXX

certbot certonly -d example.com -d *.example.com --dns-route53 --logs-dir /home/username/letsencrypt/log/ --config-dir /home/username/letsencrypt/config/ --work-dir /home/username/letsencrypt/work/ -m email@example.com --agree-tos --non-interactive --server https://acme-v02.api.letsencrypt.org/directory
certbot certonly -d styleclueless.com -d *.styleclueless.com --dns-route53 --logs-dir /home/ubuntu/letsencrypt/log/ --config-dir /home/ubuntu/letsencrypt/config/ --work-dir /home/ubuntu/letsencrypt/work/ -m info@styleclueless.com --agree-tos --non-interactive --server https://acme-v02.api.letsencrypt.org/directory

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /home/ubuntu/letsencrypt/config/live/styleclueless.com/fullchain.pem
   Your key file has been saved at:
   /home/ubuntu/letsencrypt/config/live/styleclueless.com/privkey.pem
   Your cert will expire on 2020-05-29. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le


certbot renew --dns-route53 --logs-dir /home/username/letsencrypt/log/ --config-dir /home/username/letsencrypt/config/ --work-dir /home/username/letsencrypt/work/ --non-interactive --server https://acme-v02.api.letsencrypt.org/directory --post-hook "sudo service nginx reload"
so for us =>

certbot renew --dns-route53 --logs-dir /home/ubuntu/letsencrypt/log/ --config-dir /home/ubuntu/letsencrypt/config/ --work-dir /home/ubuntu/letsencrypt/work/ --non-interactive --server https://acme-v02.api.letsencrypt.org/directory --post-hook "sudo service nginx reload"
certbot renew --dns-route53 --logs-dir /home/ubuntu/letsencrypt/log/ --config-dir /home/ubuntu/letsencrypt/config/ --work-dir /home/ubuntu/letsencrypt/work/ --non-interactive --server https://acme-v02.api.letsencrypt.org/directory"

match nginx conf to match all of this.
This is similar to the first command but instead it will try to renew all the certificates that have been created. The --post-hook lets you specify a command to run after the renew succeeds. We make this part of the command so that this command can be added to the cronjobs to automatically try and renew the certificate every day. 
create A record in route53 for ec2 ip. 

