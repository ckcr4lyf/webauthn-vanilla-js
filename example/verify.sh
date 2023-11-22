#!/bin/bash

KEY64="MCowBQYDK2VwAyEAfP8osGAz1XmwKPJZfQnx+hYGpsLX27iHkJL7GbkHYCg="
CDATA64="eyJjaGFsbGVuZ2UiOiJaR1IzTTJSM1pBIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDoxMzM3IiwidHlwZSI6IndlYmF1dGhuLmdldCJ9"
AUTHDATA64="SZYN5YgOjGh0NBcPZHZgW4/krrmihjLHmVzzuoMdl2MBAAAAFg=="
SIG64="jqujngcPpg7HegS6L9OucK7E83dKNcvBcsWjSSgf2CmyjEGR/nQx+ai9tCLgay8nFuV4zBlfxcIi/ClXR0NXCg=="

# Output public key
echo $KEY64 | base64 -d | openssl ec -pubin -pubout -out public.pem

# Raw bytes of SHA256 hash of cData
echo $CDATA64 | base64 -d | sha256sum | cut -c-64 | xxd -r -p > raw_sha

# Raw auth data
echo $AUTHDATA64 | base64 -d > raw_auth_data

# Concatenation of Auth Data & SHA256 of cData
cat raw_auth_data raw_sha > raw_concatenation

# Raw signature
echo $SIG64 | base64 -d > raw_sig

# Verify the signature
openssl pkeyutl -in raw_concatenation -rawin -verify -inkey public.pem -pubin -sigfile raw_sig