import {
  batch,
  createFluxStore,
  observer,
  useFluxComputed,
  useFluxValue,
} from '@/flux';
import { useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const basicStore$ = createFluxStore<{ count: number }>({
  initial: { count: 0 },
});

const derivedStore$ = createFluxStore<{ value: number }>({
  initial: { value: 10 },
});

const multiStoreA$ = createFluxStore<{ label: string; value: number }>({
  initial: { label: 'Store A', value: 0 },
});

const multiStoreB$ = createFluxStore<{ label: string; value: number }>({
  initial: { label: 'Store B', value: 0 },
});

const arrayStore$ = createFluxStore<{ items: string[] }>({
  initial: { items: ['Item 1', 'Item 2'] },
});

const resetStore$ = createFluxStore<{ count: number; name: string }>({
  initial: { count: 5, name: 'Initial' },
});

const nestedStore$ = createFluxStore<{
  user: {
    profile: { name: string; age: number };
    roles: string[];
    preferences: { theme: string; notifications: boolean };
  };
}>({
  initial: {
    user: {
      profile: { name: 'John', age: 25 },
      roles: ['user'],
      preferences: { theme: 'dark', notifications: true },
    },
  },
});

const transactionHistory$ = createFluxStore<{
  balance: number;
  pendingTransactions: { id: string; amount: number; description: string }[];
}>({
  initial: { balance: 1000, pendingTransactions: [] },
});

const validationStore$ = createFluxStore<{
  form: { username: string; email: string; age: number };
  errors: { username: string | null; email: string | null; age: string | null };
}>({
  initial: {
    form: { username: '', email: '', age: 0 },
    errors: { username: null, email: null, age: null },
  },
});

const searchFilterStore$ = createFluxStore<{
  items: { id: number; name: string; category: string; price: number }[];
  filters: {
    search: string;
    category: string;
    minPrice: number;
    maxPrice: number;
  };
}>({
  initial: {
    items: [
      { id: 1, name: 'Laptop', category: 'electronics', price: 999 },
      { id: 2, name: 'Shirt', category: 'clothing', price: 29 },
      { id: 3, name: 'Phone', category: 'electronics', price: 699 },
      { id: 4, name: 'Pants', category: 'clothing', price: 49 },
      { id: 5, name: 'Tablet', category: 'electronics', price: 499 },
    ],
    filters: { search: '', category: '', minPrice: 0, maxPrice: 9999 },
  },
});

const computedChainsStore$ = createFluxStore<{
  baseValue: number;
  step: number;
}>({
  initial: { baseValue: 5, step: 2 },
});

const BasicCounter = observer(() => {
  const count = useFluxValue(basicStore$.count);
  return (
    <View style={styles.testCard}>
      <Text style={styles.testTitle}>1. Basic Counter</Text>
      <Text style={styles.testValue}>{count}</Text>
      <View style={styles.buttonRow}>
        <Button
          title="Increment"
          onPress={() => basicStore$.count.set((prev) => prev + 1)}
        />
        <Button
          title="Decrement"
          onPress={() => basicStore$.count.set((prev) => prev - 1)}
        />
      </View>
    </View>
  );
});

const DerivedState = observer(() => {
  const value = useFluxValue(derivedStore$.value);
  const doubled = useFluxComputed(() => derivedStore$.value.get() * 2);
  const isEven = useFluxComputed(() => derivedStore$.value.get() % 2 === 0);

  return (
    <View style={styles.testCard}>
      <Text style={styles.testTitle}>2. Derived State</Text>
      <Text style={styles.testValue}>Value: {value}</Text>
      <Text style={styles.testValue}>Doubled: {doubled}</Text>
      <Text style={styles.testValue}>{isEven ? 'Even' : 'Odd'}</Text>
      <View style={styles.buttonRow}>
        <Button
          title="+5"
          onPress={() => derivedStore$.value.set((prev) => prev + 5)}
        />
        <Button
          title="-3"
          onPress={() => derivedStore$.value.set((prev) => prev - 3)}
        />
      </View>
    </View>
  );
});

const MultipleStores = observer(() => {
  const aValue = useFluxValue(multiStoreA$.value);
  const bValue = useFluxValue(multiStoreB$.value);
  const aLabel = useFluxValue(multiStoreA$.label);
  const bLabel = useFluxValue(multiStoreB$.label);

  return (
    <View style={styles.testCard}>
      <Text style={styles.testTitle}>3. Multiple Stores</Text>
      <Text style={styles.testValue}>
        {aLabel}: {aValue}
      </Text>
      <Text style={styles.testValue}>
        {bLabel}: {bValue}
      </Text>
      <View style={styles.buttonRow}>
        <Button
          title="A +1"
          onPress={() => multiStoreA$.value.set((p) => p + 1)}
        />
        <Button
          title="B +1"
          onPress={() => multiStoreB$.value.set((p) => p + 1)}
        />
      </View>
    </View>
  );
});

const BatchUpdates = observer(() => {
  const [display, setDisplay] = useState('');

  const handleBatch = () => {
    batch(() => {
      basicStore$.count.set(100);
      derivedStore$.value.set(50);
    });
    setDisplay('Batched: count→100, value→50');
  };

  return (
    <View style={styles.testCard}>
      <Text style={styles.testTitle}>4. Batch Updates</Text>
      <Text style={styles.testValue}>{display || 'Click to batch update'}</Text>
      <Button title="Batch Update" onPress={handleBatch} />
    </View>
  );
});

const ArrayState = observer(() => {
  const items = useFluxValue(arrayStore$.items);

  const addItem = () => {
    const next = items.length + 1;
    arrayStore$.items.push(`Item ${next}`);
  };

  const removeLast = () => {
    if (items.length > 0) {
      arrayStore$.items.pop();
    }
  };

  return (
    <View style={styles.testCard}>
      <Text style={styles.testTitle}>5. Array State</Text>
      {items.map((item: string) => (
        <Text key={item} style={styles.testValue}>
          • {item}
        </Text>
      ))}
      <View style={styles.buttonRow}>
        <Button title="Add" onPress={addItem} />
        <Button title="Remove" onPress={removeLast} />
      </View>
    </View>
  );
});

const ResetState = observer(() => {
  const count = useFluxValue(resetStore$.count);
  const name = useFluxValue(resetStore$.name);

  const reset = () => {
    resetStore$.set({ count: 5, name: 'Initial' });
  };

  const update = () => {
    resetStore$.count.set(99);
    resetStore$.name.set('Updated');
  };

  return (
    <View style={styles.testCard}>
      <Text style={styles.testTitle}>6. Reset State</Text>
      <Text style={styles.testValue}>Count: {count}</Text>
      <Text style={styles.testValue}>Name: {name}</Text>
      <View style={styles.buttonRow}>
        <Button title="Update" onPress={update} />
        <Button title="Reset" onPress={reset} />
      </View>
    </View>
  );
});

const NestedObjectState = observer(() => {
  const name = useFluxValue(nestedStore$.user.profile.name);
  const age = useFluxValue(nestedStore$.user.profile.age);
  const roles = useFluxValue(nestedStore$.user.roles);
  const theme = useFluxValue(nestedStore$.user.preferences.theme);
  const hasNotifications = useFluxValue(
    nestedStore$.user.preferences.notifications
  );

  const updateProfile = () => {
    batch(() => {
      nestedStore$.user.profile.name.set('Jane');
      nestedStore$.user.profile.age.set(30);
    });
  };

  const toggleRole = () => {
    const currentRoles = roles;
    if (currentRoles.includes('admin')) {
      nestedStore$.user.roles.set(['user']);
    } else {
      nestedStore$.user.roles.push('admin');
    }
  };

  const toggleTheme = () => {
    nestedStore$.user.preferences.theme.set(
      theme === 'dark' ? 'light' : 'dark'
    );
  };

  const toggleNotifications = () => {
    nestedStore$.user.preferences.notifications.set(!hasNotifications);
  };

  return (
    <View style={styles.testCard}>
      <Text style={styles.testTitle}>7. Nested Object State</Text>
      <Text style={styles.testValue}>
        Name: {name} (Age: {age})
      </Text>
      <Text style={styles.testValue}>Roles: {roles.join(', ')}</Text>
      <Text style={styles.testValue}>Theme: {theme}</Text>
      <Text style={styles.testValue}>
        Notifications: {hasNotifications ? 'On' : 'Off'}
      </Text>
      <View style={styles.buttonRow}>
        <Button title="Update" onPress={updateProfile} />
        <Button title="Role" onPress={toggleRole} />
      </View>
      <View style={styles.buttonRow}>
        <Button title="Theme" onPress={toggleTheme} />
        <Button title="Notif" onPress={toggleNotifications} />
      </View>
    </View>
  );
});

const TransactionQueue = observer(() => {
  const balance = useFluxValue(transactionHistory$.balance);
  const pending = useFluxValue(transactionHistory$.pendingTransactions);
  const hasPending = useFluxComputed(() => pending.length > 0);

  const addTransaction = (description: string, amount: number) => {
    const id = `txn-${Date.now()}`;
    batch(() => {
      transactionHistory$.balance.set((prev) => prev - amount);
      transactionHistory$.pendingTransactions.push({ id, amount, description });
    });
  };

  const processTransactions = () => {
    batch(() => {
      while (pending.length > 0) {
        transactionHistory$.pendingTransactions.shift();
      }
      transactionHistory$.balance.set(0);
    });
  };

  const pendingTotal = useFluxComputed(() =>
    pending.reduce((sum: number, tx: { amount: number }) => sum + tx.amount, 0)
  );

  const handlePurchase = () => addTransaction('Online Purchase', 150);
  const handleSubscription = () => addTransaction('Monthly Sub', 25);

  return (
    <View style={styles.testCard}>
      <Text style={styles.testTitle}>8. Transaction Queue</Text>
      <Text style={styles.testValue}>Balance: ${balance}</Text>
      <Text style={styles.testValue}>
        Pending: {pending.length} (${pendingTotal})
      </Text>
      {pending.map(
        (tx: { id: string; amount: number; description: string }) => (
          <Text key={tx.id} style={styles.testValue}>
            • {tx.description} (-${tx.amount})
          </Text>
        )
      )}
      {hasPending && (
        <Button title="Process All" onPress={processTransactions} />
      )}
      <View style={styles.buttonRow}>
        <Button title="Buy $150" onPress={handlePurchase} />
        <Button title="Sub $25" onPress={handleSubscription} />
      </View>
    </View>
  );
});

const FormValidation = observer(() => {
  const form = useFluxValue(validationStore$.form);
  const errors = useFluxValue(validationStore$.errors);
  const isValid = useFluxComputed(
    () =>
      form.username.length >= 3 &&
      form.email.includes('@') &&
      form.age >= 18 &&
      !errors.username &&
      !errors.email &&
      !errors.age
  );

  const handleUsernameChange = (value: string) => {
    validationStore$.form.username.set(value);
    validationStore$.errors.username.set(
      value.length < 3 ? 'Username must be 3+ chars' : null
    );
  };

  const handleEmailChange = (value: string) => {
    validationStore$.form.email.set(value);
    validationStore$.errors.email.set(
      !value.includes('@') ? 'Invalid email' : null
    );
  };

  const handleAgeChange = (value: string) => {
    const ageNum = Number.parseInt(value, 10) || 0;
    validationStore$.form.age.set(ageNum);
    validationStore$.errors.age.set(ageNum < 18 ? 'Must be 18+' : null);
  };

  const handleRandomize = () => {
    batch(() => {
      const usernames = ['user', 'admin', 'test', 'dev'];
      const username = `${usernames[Math.floor(Math.random() * usernames.length)]}${Math.floor(Math.random() * 100)}`;
      const emails = ['test.com', 'example.org', 'demo.net'];
      const email = `${username}@${emails[Math.floor(Math.random() * emails.length)]}`;
      const age = 18 + Math.floor(Math.random() * 50);

      validationStore$.form.username.set(username);
      validationStore$.form.email.set(email);
      validationStore$.form.age.set(age);
      validationStore$.errors.username.set(null);
      validationStore$.errors.email.set(null);
      validationStore$.errors.age.set(null);
    });
  };

  return (
    <View style={styles.testCard}>
      <Text style={styles.testTitle}>9. Form Validation</Text>
      <Text style={styles.inputLabel}>Username:</Text>
      <TextInput
        style={styles.input}
        value={form.username}
        onChangeText={handleUsernameChange}
        placeholder="Enter username"
      />
      {errors.username && (
        <Text style={[styles.testValue, styles.errorText]}>
          {errors.username}
        </Text>
      )}
      <Text style={styles.inputLabel}>Email:</Text>
      <TextInput
        style={styles.input}
        value={form.email}
        onChangeText={handleEmailChange}
        placeholder="Enter email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && (
        <Text style={[styles.testValue, styles.errorText]}>{errors.email}</Text>
      )}
      <Text style={styles.inputLabel}>Age:</Text>
      <TextInput
        style={styles.input}
        value={form.age === 0 ? '' : String(form.age)}
        onChangeText={handleAgeChange}
        placeholder="Enter age"
        keyboardType="number-pad"
      />
      {errors.age && (
        <Text style={[styles.testValue, styles.errorText]}>{errors.age}</Text>
      )}
      <Text style={styles.testValue}>Valid: {isValid ? 'Yes' : 'No'}</Text>
      <View style={styles.buttonRow}>
        <Button title="Random" onPress={handleRandomize} />
        <Button
          title="Clear"
          onPress={() =>
            batch(() => {
              validationStore$.form.username.set('');
              validationStore$.form.email.set('');
              validationStore$.form.age.set(0);
              validationStore$.errors.username.set(null);
              validationStore$.errors.email.set(null);
              validationStore$.errors.age.set(null);
            })
          }
        />
      </View>
    </View>
  );
});

const SearchAndFilter = observer(() => {
  const items = useFluxValue(searchFilterStore$.items);
  const filters = useFluxValue(searchFilterStore$.filters);

  const handleSearchChange = (value: string) => {
    searchFilterStore$.filters.search.set(value);
  };

  const handleCategoryChange = (value: string) => {
    const validCategories = ['', 'electronics', 'clothing'];
    if (validCategories.includes(value.toLowerCase())) {
      searchFilterStore$.filters.category.set(value.toLowerCase());
    }
  };

  const handleMinPriceChange = (value: string) => {
    const min = Number.parseInt(value, 10) || 0;
    searchFilterStore$.filters.minPrice.set(min);
  };

  const handleMaxPriceChange = (value: string) => {
    const max = Number.parseInt(value, 10) || 9999;
    searchFilterStore$.filters.maxPrice.set(max);
  };

  const filteredItems = useFluxComputed(() => {
    let result = items;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (item: { name: string; category: string; price: number }) =>
          item.name.toLowerCase().includes(searchLower)
      );
    }
    if (filters.category) {
      result = result.filter(
        (item: { category: string }) => item.category === filters.category
      );
    }
    if (filters.minPrice > 0 || filters.maxPrice < 9999) {
      result = result.filter(
        (item: { price: number }) =>
          item.price >= filters.minPrice && item.price <= filters.maxPrice
      );
    }
    return result;
  });

  const totalValue = useFluxComputed(() =>
    filteredItems.reduce(
      (sum: number, item: { price: number }) => sum + item.price,
      0
    )
  );

  const clearFilters = () => {
    batch(() => {
      searchFilterStore$.filters.search.set('');
      searchFilterStore$.filters.category.set('');
      searchFilterStore$.filters.minPrice.set(0);
      searchFilterStore$.filters.maxPrice.set(9999);
    });
  };

  return (
    <View style={styles.testCard}>
      <Text style={styles.testTitle}>10. Search & Filter</Text>
      <Text style={styles.inputLabel}>Search:</Text>
      <TextInput
        style={styles.input}
        value={filters.search}
        onChangeText={handleSearchChange}
        placeholder="Search items..."
      />
      <Text style={styles.inputLabel}>Category:</Text>
      <TextInput
        style={styles.input}
        value={filters.category}
        onChangeText={handleCategoryChange}
        placeholder="electronics, clothing..."
      />
      <View style={styles.priceRow}>
        <View style={styles.priceInput}>
          <Text style={styles.inputLabel}>Min $:</Text>
          <TextInput
            style={styles.input}
            value={filters.minPrice === 0 ? '' : String(filters.minPrice)}
            onChangeText={handleMinPriceChange}
            placeholder="0"
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.priceInput}>
          <Text style={styles.inputLabel}>Max $:</Text>
          <TextInput
            style={styles.input}
            value={filters.maxPrice === 9999 ? '' : String(filters.maxPrice)}
            onChangeText={handleMaxPriceChange}
            placeholder="9999"
            keyboardType="number-pad"
          />
        </View>
      </View>
      <Text style={styles.testValue}>
        Results: {filteredItems.length} (Total: ${totalValue})
      </Text>
      {filteredItems.map(
        (item: { id: number; name: string; price: number }) => (
          <Text key={item.id} style={styles.testValue}>
            • {item.name}: ${item.price}
          </Text>
        )
      )}
      <View style={styles.buttonRow}>
        <Button title="Clear" onPress={clearFilters} />
      </View>
    </View>
  );
});

const ComputedChain = observer(() => {
  const baseValue = useFluxValue(computedChainsStore$.baseValue);
  const step = useFluxValue(computedChainsStore$.step);

  const doubled = useFluxComputed(() => baseValue * 2);
  const tripled = useFluxComputed(() => doubled * step);
  const squared = useFluxComputed(() => tripled ** 2);
  const modulo = useFluxComputed(() => squared % 100);

  const incrementBase = () =>
    computedChainsStore$.baseValue.set((prev) => prev + 1);
  const incrementStep = () => computedChainsStore$.step.set((prev) => prev + 1);

  return (
    <View style={styles.testCard}>
      <Text style={styles.testTitle}>11. Computed Chain</Text>
      <Text style={styles.testValue}>Base: {baseValue}</Text>
      <Text style={styles.testValue}>Step: {step}</Text>
      <Text style={styles.testValue}>Doubled: {doubled}</Text>
      <Text style={styles.testValue}>Tripled: {tripled}</Text>
      <Text style={styles.testValue}>Squared: {squared}</Text>
      <Text style={styles.testValue}>Mod 100: {modulo}</Text>
      <View style={styles.buttonRow}>
        <Button title="Base+1" onPress={incrementBase} />
        <Button title="Step+1" onPress={incrementStep} />
      </View>
    </View>
  );
});

export function FluxTestUI() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Flux UI Tests</Text>
      <Text style={styles.subHeader}>
        Interactive tests to verify flux state management
      </Text>

      <BasicCounter />
      <DerivedState />
      <MultipleStores />
      <BatchUpdates />
      <ArrayState />
      <ResetState />
      <NestedObjectState />
      <TransactionQueue />
      <FormValidation />
      <SearchAndFilter />
      <ComputedChain />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  testCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  testValue: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 16,
  },
  priceInput: {
    flex: 1,
  },
});
