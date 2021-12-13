obj-m += memo_201612378.o
all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules
clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean

test:
	sudo dmesg -C
	sudo insmod memo_201612378.ko
	sudo rmmod memo_201612378.ko
	dmesg