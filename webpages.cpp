#include <bits/stdc++.h>
using namespace std;
 
bool BFS(vector<int> adj[], int src, int dest, int v,int dist[])
{

    list<int> queue;
 
    bool visited[v];
 
    for (int i = 0; i < v; i++) {
        visited[i] = false;
        dist[i] = INT_MAX;
    }
 
    visited[src] = true;
    dist[src] = 0;
    queue.push_back(src);
 
    // standard BFS algorithm
    while (!queue.empty()) {
        int u = queue.front();
        queue.pop_front();
        int l = adj[u].size();
        for (int i = 0; i < l; i++) {
            if (visited[adj[u][i]] == false) {
                visited[adj[u][i]] = true;
                dist[adj[u][i]] = dist[u] + 1;
                queue.push_back(adj[u][i]);
 
                // We stop BFS when we find
                // destination.
                if (adj[u][i] == dest)
                    return true;
            }
        }
    }
 
    return false;
}
 
void printShortestDistance(vector<int> adj[], int s, int dest, int v)
{
    int dist[v];
 
    if (BFS(adj, s, dest, v, dist) == false) {
        cout<<"-1"<<endl;
        return;
    }
    cout<< dist[dest];
}
 
// Driver program to test above functions
int main()
{

    // #ifndef ONLINE_JUDGE
    // freopen("input.txt", "r", stdin);
    // freopen("output.txt", "w", stdout);
    // freopen("err.txt", "w", stderr);
    // #endif // ONLINE_JUDGE

    // no. of vertices
    int n;
    cin>>n;
    vector<int> adj[n];
    int k=0, source, dest;

    for(int i=0;i<=n+1;i++){
    
        vector<int> d;
        string str, wd;
        getline(cin, str);
        stringstream s(str);
        if(i==n+1){
            string wd1;
            int ci=0;
            while(s >> wd1){
                //cout<<wd1<<endl;
                if(ci==0)
                source = stoi(wd1) - 1;
                else if(ci==1){
                dest = stoi(wd1) - 1;
                }
                else{
                    continue;
                }
                ci++;
            }
        }
        else{
            while(s >> wd){
                int num = stoi(wd) - 1;
                d.push_back(num);
            }
            if(i!=0){
                adj[k] = d;
                k++;
            }
            d.clear();
        }
    }
    
    if(source == dest)
    cout<<"0"<<endl;
    else{
    printShortestDistance(adj, source, dest, n);
    }
    return 0;
}