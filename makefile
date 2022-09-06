## ------------------------
## Typescript makefile
## Author: Carlos L. Cuenca

## ---------
## Variables

compiler:=tsc
control:=git
target:=clcuenca-dev
message?:=Re-Commit
branch?=main
hub_origin:=origin
aws_origin:=aws-origin

## -------
## Targets

$(target):
	clear && reset
	$(compiler)
	$(control) add *
	$(control) commit -m "$(message)"
	$(control) push -u $(hub_origin) $(branch)
	$(control) push -u $(aws_origin) $(branch)
