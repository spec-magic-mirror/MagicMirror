import boto3
import os
import time
from datetime import datetime
import sys
import json

access_key = "AKIAIIFEBAKIVYW6MUTA"
access_secret = "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"
region = "us-east-1"
queue_url = "https://sqs.us-east-1.amazonaws.com/257287892442/AlexaSkillMagicMirror"

def dbg(msg):
    with open("./error_log.txt","a+") as f:
        time_str = str(datetime.now())
        f.write(time_str + ": " + msg + "\n")  
    f.close() 

def pop_message(client, url):
    response = client.receive_message(QueueUrl = url, MaxNumberOfMessages = 10)

    #last message posted becomes messages
    message = response['Messages'][0]['Body']
    receipt = response['Messages'][0]['ReceiptHandle']
    client.delete_message(QueueUrl = url, ReceiptHandle = receipt)
    return message

def to_node(type, message):
    # Send message to MMM
    # convert to json and print (node helper will read from stdout)
    try:
        print(json.dumps({type: message}))
    except Exception:
        pass
    # stdout has to be flushed manually to prevent delays in the node helper
    # communication
    sys.stdout.flush()

dbg("Enter python code")
client = boto3.client('sqs', aws_access_key_id = access_key, aws_secret_access_key = access_secret, region_name = region)
waittime = 2
client.set_queue_attributes(QueueUrl = queue_url, Attributes = {'ReceiveMessageWaitTimeSeconds': str(waittime)})
time_start = time.time()
while (time.time() - time_start < 15):
    try:
        message = pop_message(client, queue_url)    
        dbg(message)    
        if message == "on":
            # os.system("~/tvon.sh")
            dbg("receive ON command!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            
        elif message == "off":
            # os.system("~/tvoff.sh")
            dbg("receive OFF command!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            
        elif message == "mole":
            dbg("receive MOLE command!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            to_node('mole', True)
            dbg("send to node helper")
    except Exception:
        pass

dbg("Exit check queue")