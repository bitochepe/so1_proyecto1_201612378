 // SPDX-License-Identifier: GPL-3.0
#include <linux/kernel.h>       // printk(), pr_*()
#include <linux/module.h>       // THIS_MODULE, MODULE_VERSION, ...
#include <linux/init.h>         // module_{init,exit}
#include <linux/sched/task.h>   // struct task_struct, {get,put}_task_struct()
#include <linux/sched/signal.h> // for_each_process()
#include <linux/mm.h>           // get_mm_rss()

/* Tested on kernel 5.6, qemu-system-aarch64
 * Usage: sudo insmod task_rss
 *        sudo modprobe task_rss
 */

#ifdef pr_fmt
#undef pr_fmt
#endif
#define pr_fmt(fmt) KBUILD_MODNAME ": " fmt

static int __init modinit(void)
{
    struct task_struct *tsk;
    unsigned long rss;

#ifndef CONFIG_MMU
    pr_err("No MMU, cannot calculate RSS.\n");
    return -EINVAL;
#endif

    for_each_process(tsk) {
        get_task_struct(tsk);

        // https://www.kernel.org/doc/Documentation/vm/active_mm.rst
        if (tsk->mm) {
            rss = get_mm_rss(tsk->mm);
            pr_info("PID %d (\"%s\") VmRSS = %lu bytes\n", tsk->pid, tsk->comm, rss);
        } else {
            pr_info("PID %d (\"%s\") is an anonymous process\n", tsk->pid, tsk->comm);
        }

        put_task_struct(tsk);
    }

    return 0;
}

static void __exit modexit(void)
{
    // This function is only needed to be able to unload the module.
}

module_init(modinit);
module_exit(modexit);
MODULE_VERSION("0.1");
MODULE_DESCRIPTION("Silly test module to calculare task RSS of all running tasks.");
MODULE_AUTHOR("Marco Bonelli");
MODULE_LICENSE("GPL");