---
title: Declarative Identity
date: 2026-06-30
description: What I learned moving to NixOS. The philosophy, the nightmare, the lessons, and why I'll never go back to imperative configs.
favorite: true
github: https://github.com/notseekeru/nixos-config
---

---

# Summary

I needed an OS I could trust. Not trust to stay running. Trust to stay _correct_. After years of accumulating config drift, symlink graveyards, and the quiet dread of "did I manually patch that file six months ago?", I jumped into NixOS. This is the transition: the philosophy that sold me, the partition table I finally conquered, the 10-hour Hyprland debugging rabbit hole, and the quiet satisfaction of a fully reproducible daily driver.

---

## The Pitch That Hooked Me

It started with a question: can I declare my entire operating system in a config file and have it _actually_ be that system?

Not "mostly." Not "you still need to manually install these three packages and tweak this one obscure kernel parameter." Actually, completely, verifiably the same system every time I rebuild.

That's the declarative promise. You write _what_ you want, not _how_ to get there. The system figures out the how. Imperative configs are a recipe book, step by step, easy to skip one, easy to miss one. Declarative configs are a blueprint. Either the blueprint matches reality, or it doesn't.

NixOS is the only OS that takes this seriously. Every package, every service, every kernel parameter, it all lives in `/etc/nixos/configuration.nix` (or your Flake, if you're civilized). No "well this one dotfile is managed by a script, and that one is a symlink, and I think I edited that config in `/usr/share` three years ago." It's all in one place, all version-controlled, all atomic.

I bought the pitch.

## The First Wall: Owning the Partition Table

Before you can declare your system, you have to install it. NixOS doesn't hold your hand.

The installer has an auto-partitioning option, but I've been burned by auto-layouts before. Defaults are designed for the average case, and I'm never the average case. So I went manual.

Partitioning isn't hard, it's just unforgiving. One wrong sector boundary and you're staring at a boot failure. I set up my EFI partition, my ext4 root, my swap. I double-checked the mount points. I triple-checked them. Then I ran the install and watched it fail because I forgot to mount the boot partition before the root.

Classic. Rinse and repeat.

But here's the thing: after the third attempt, I actually understood my partition table. I knew why each partition existed, what it was for, and what would break if I moved it. That knowledge is worth the upfront pain. No more "I hope the installer did it right." I own that table.

I also landed on label-based mounting instead of hardcoded device paths. No copying `hardware-configuration.nix` and praying the disk IDs match. Just labels:

```nix
fileSystems."/" = {
  device = "/dev/disk/by-label/ROOT";
  fsType = "ext4";
};

fileSystems."/boot" = {
  device = "/dev/disk/by-label/ESP";
  fsType = "vfat";
};
```

Portable across machines, readable at a glance, survives kernel upgrades that shuffle `/dev/sda` naming.

![Paper stack of the manual install. The disk holds three partitions: ESP with vfat and label ESP mounted at /boot, ROOT with ext4 and label ROOT mounted at /, and swap with no label and no mount. The install creates the partitions, mounts root, runs nixos-install, and fails because boot is not mounted; mounting /boot and rerunning installs. The mounts use labels, not /dev/sda names.](/nixos-partitions.png)

## The 10-Hour SDDM War

The install worked. The system booted. Black screen.

Getting Hyprland to start on login ate 10 hours.

The problem was SDDM, the session manager. Hyprland would launch fine from a TTY, just `Hyprland` at a prompt and it worked perfectly. But through SDDM? Black screen. No errors, no logs, just nothing.

I tried everything. Config tweaks, forum workarounds, hacks that felt wrong but I tried anyway. Switched to LightDM. Same result.

Almost gave up. Was drafting the "NixOS wasn't for me" post in my head.

Then I tried greetd with tuigreet. It worked. First try.

The lesson: not all session managers are equal on Wayland. SDDM and LightDM were built for X11 first, Wayland second. greetd is Wayland-native, no abstraction layers over a display server it barely understands. If I had researched "session managers native to Wayland" instead of "session managers that support Wayland," I would have saved 9 hours.

Or simpler: auto-login to a TTY, one zsh script that launches Hyprland. No session manager. One file, one `exec`.

But hey, it works. And I learned more about Linux display management in those 10 hours than I had in the previous five years. Sometimes the war is the education.

![Paper comparison of four ways into Hyprland. From a TTY the compositor launches from a prompt. SDDM and LightDM each support Wayland and give a black screen. greetd with tuigreet is native to Wayland and works first try. Auto-login to a TTY with one exec script also works.](/nixos-sessions.png)

## Flakes and the Death of Channel Rot

Early on, I used Nix channels. It's the traditional way, you subscribe to a channel (like `nixos-24.11`), update it periodically, and rebuild. It works, but it's not pure. Channels are mutable state. You can never be 100% sure what version of `nixpkgs` you pinned last week.

Flakes fix this. A Flake locks your entire dependency tree in a `flake.lock` file. Every input, every version, every hash. When you rebuild, you get exactly the same packages, the same builds, the same behavior. Reproducibility is guaranteed.

Migrating was a one-time effort. I rewrote my config as a Flake, and `nixos-rebuild switch` became a single atomic operation I actually trusted. If it works now, it works in six months.

## Home-Manager: Exiling the Symlink Spaghetti

Dotfiles were always the weakest link in my setup. I'd have a Git repo with symlinks, a bootstrap script, and a prayer that nothing broke.

Home-Manager kills that entire class of problems. It's NixOS for your home directory. Your Neovim config, your zshrc, your tmux.conf, all declared in Nix, all built into your system, all reproducible.

No more symlink spaghetti. Every dotfile is version-controlled alongside my system config, rebuilt atomically with everything else.

I even ditched tmux-resurrect and continuum. Instead of saving and restoring sessions, I wrote scripts using tmux-init to declare sessions upfront. My dev environment is defined in config, not recovered from a save file.

## The Declarative Dividend

After the migration, something shifted. I stopped thinking of my system as something I maintain and started thinking of it as something I compile.

When something breaks, I change the config and rebuild. If it breaks something else, I roll back. NixOS keeps every generation. Rollback is a single bootloader entry.

New machine? Copy the Flake, run `nixos-rebuild`, walk away.

Project environments? direnv + flakes. `cd` into a project, the shell loads the exact Nix environment. No `nix-shell`. The environment just _is_.

This is the declarative investment. I don't maintain my system anymore. I _design_ it.

---

# Conclusion

NixOS exceeded my expectations.

The declarative mindset isn't just about NixOS. It's about treating infrastructure, even personal infrastructure, as code. Desired state, not manual steps. Blueprints, not recipes. Compilation, not maintenance.

---

_Check out my [Nix Config](https://github.com/notseekeru/nixos-config) for the actual Configs with Waybar, Flake and Home-Manager setup that runs this machine._
