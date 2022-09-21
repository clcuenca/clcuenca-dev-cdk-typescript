## ------------------------
## Typescript makefile
## Author: Carlos L. Cuenca

## ---------
## Variables

compiler:=tsc
control:=git
target:=clcuenca-dev
message?=Re-Commit
branch?=main
hub_origin:=origin
aws_origin:=aws-origin

## -------
## Targets

$(target):
	clear && reset
	$(compiler)
	$(control) add * > /dev/null 2&>1
	$(control) commit -m "$(message)" > /dev/null 2&>1
	$(control) push -u $(hub_origin) $(branch)
	$(control) push -u $(aws_origin) $(branch) && rm 1
