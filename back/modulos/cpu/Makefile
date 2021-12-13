obj-m += cpu_201612378.o
all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules
clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean

test:
	sudo dmesg -C
	sudo insmod cpu_201612378.ko
	sudo rmmod cpu_201612378.ko
	dmesg