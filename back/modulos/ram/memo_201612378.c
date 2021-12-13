#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
#include <linux/seq_file.h>
#include <linux/hugetlb.h>
#include <linux/swap.h>
#include <linux/vmstat.h>


struct sysinfo inf;

static int escribir_memo(struct seq_file *m, void *v)
{
    si_meminfo(&inf);

    long memoriaTotal = inf.totalram*(unsigned long)inf.mem_unit/(1024*1024);
    long memoriaLibre = inf.freeram*(unsigned long)inf.mem_unit/(1024*1024);
    long memoriaCompartida = inf.sharedram*(unsigned long)inf.mem_unit/(1024*1024);
    long memoriaUsada = memoriaTotal - (memoriaLibre + memoriaCompartida);

    seq_printf(m, "memTotal: %lu\n",memoriaTotal);
    seq_printf(m, "memLibre: %lu\n",memoriaLibre);
    seq_printf(m, "memCompartida: %lu\n",memoriaCompartida);
    return 0;
}

static int abre_memo(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_memo, NULL);
}

static struct proc_ops ops_memo={
    .proc_open = abre_memo,
    .proc_read = seq_read
};


static int __init memoMod_init(void)
{
    struct proc_dir_entry *entry;
    entry = proc_create("memo_201612378", 0777, NULL, &ops_memo);
    if (!entry)
	{
		return -1;
	}
	else
	{
		printk(KERN_INFO "201612378\n");
	}
	return 0;
}

static void __exit memoMod_exit(void)
{
    remove_proc_entry("memo_201612378", NULL);
    printk(KERN_INFO "Sistemas operativos 1\n");
}


module_init(memoMod_init);
module_exit(memoMod_exit);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("bitochepe - 201612378");
MODULE_DESCRIPTION("Modulo de memoria SO1"); 